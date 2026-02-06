import { db_connection } from "@/lib/db";
import { BusinessModel } from "@/models/business.model";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { params: Promise<{ ownerId: string }> };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { ownerId } = await params.params;

    await db_connection();

    const business = await BusinessModel.findOne({ ownerId });
    
    if (!business) {
      return NextResponse.json(
        { success: false, message: "Business not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, business }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve business details", error },
      { status: 500 },
    );
  }
}
