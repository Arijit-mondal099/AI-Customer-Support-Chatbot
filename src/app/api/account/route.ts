import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { OwnerModel } from "@/models/owner.model";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

export async function GET() {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  await db_connection();
  const doc = await OwnerModel.findOne({ ownerId: owner.ownerId })
    .select("+notionIntegrationToken")
    .lean();
  return NextResponse.json({
    success: true,
    hasNotionIntegration: !!(doc?.notionIntegrationToken as string),
  });
}

export async function PUT(request: NextRequest) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const body = (await request.json()) as { notionIntegrationToken?: string };
  const token = body.notionIntegrationToken?.trim();

  await db_connection();
  await OwnerModel.updateOne(
    { ownerId: owner.ownerId },
    { $set: { notionIntegrationToken: token || "" } },
    { upsert: true },
  );

  return NextResponse.json({
    success: true,
    hasNotionIntegration: !!token,
  });
}
