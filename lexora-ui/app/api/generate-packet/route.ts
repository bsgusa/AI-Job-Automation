import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase";
import { generatePacket } from "@/lib/pdf-generator";
import { analyzeRFERisks, generateChecklist, generateFilingInstructions } from "@/lib/rag";
import type { IntakeData } from "@/types/immigration";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, intakeData } = await req.json() as {
      sessionId: string;
      intakeData: IntakeData;
    };

    if (!sessionId || !intakeData) {
      return NextResponse.json(
        { error: "sessionId and intakeData are required" },
        { status: 400 }
      );
    }

    const sb = getServiceSupabase();

    // Verify payment exists and is in the right state
    const { data: caseRow, error: fetchErr } = await sb
      .from("marriage_cases")
      .select("id, status, email")
      .eq("stripe_session_id", sessionId)
      .single();

    if (fetchErr || !caseRow) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    if (!["paid", "intake_complete"].includes(caseRow.status)) {
      return NextResponse.json(
        { error: "Payment not verified or packet already generated" },
        { status: 400 }
      );
    }

    // Mark as generating
    await sb
      .from("marriage_cases")
      .update({ status: "generating", intake_data: intakeData })
      .eq("id", caseRow.id);

    // Run Claude analysis + PDF generation in parallel
    const [checklistResult, rfeResult, instructionsResult, packetResult] =
      await Promise.allSettled([
        generateChecklist(intakeData),
        analyzeRFERisks(intakeData),
        generateFilingInstructions(intakeData),
        generatePacket(intakeData),
      ]);

    const checklist = checklistResult.status === "fulfilled" ? checklistResult.value : [];
    const rfeRisks = rfeResult.status === "fulfilled" ? rfeResult.value : [];
    const filingInstructions =
      instructionsResult.status === "fulfilled" ? instructionsResult.value : "";
    const packet = packetResult.status === "fulfilled" ? packetResult.value : { forms: [], errors: [] };

    // Upload PDFs to Supabase Storage
    let packetPath: string | null = null;
    if (packet.forms.length > 0) {
      for (const form of packet.forms) {
        const storagePath = `${caseRow.id}/${form.name}`;
        const { error: uploadErr } = await sb.storage
          .from("case-documents")
          .upload(storagePath, form.bytes, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (!uploadErr && !packetPath) {
          // Store the folder path; individual forms are {id}/FormName.pdf
          packetPath = caseRow.id;
        }
      }
    }

    // Update case with results
    await sb.from("marriage_cases").update({
      status: "complete",
      generated_packet_path: packetPath,
      checklist,
      rfe_risks: rfeRisks,
      filing_instructions: filingInstructions,
    }).eq("id", caseRow.id);

    // Build signed download URLs for each form
    const downloadUrls: { name: string; url: string }[] = [];
    if (packetPath) {
      for (const form of packet.forms) {
        const { data: signed } = await sb.storage
          .from("case-documents")
          .createSignedUrl(`${packetPath}/${form.name}`, 60 * 60 * 24); // 24h
        if (signed?.signedUrl) {
          downloadUrls.push({ name: form.name, url: signed.signedUrl });
        }
      }
    }

    return NextResponse.json({
      caseId: caseRow.id,
      checklist,
      rfeRisks,
      filingInstructions,
      downloadUrls,
      pdfErrors: packet.errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("generate-packet error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
