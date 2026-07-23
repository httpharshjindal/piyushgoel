import { NextResponse } from "next/server";
import { createAuditEvent } from "@/db/dal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await createAuditEvent({
      event: body.event || "click",
      targetType: body.targetType || "card",
      targetId: body.targetId || "",
      location: body.location || "portfolio",
      userId: body.userId || "anonymous",
      metadata: body.metadata || {},
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 200 });
  }
}
