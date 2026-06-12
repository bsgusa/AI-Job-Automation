import { NextRequest, NextResponse } from "next/server";
import { getStepGuidance } from "@/lib/rag";
import type { GuidanceRequest } from "@/lib/rag";

export async function POST(req: NextRequest) {
  try {
    const body: GuidanceRequest = await req.json();

    if (!body.question?.trim()) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const result = await getStepGuidance(body);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
