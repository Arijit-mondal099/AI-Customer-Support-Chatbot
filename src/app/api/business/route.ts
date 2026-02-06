import { db_connection } from "@/lib/db";
import { BusinessModel } from "@/models/business.model";
import { NextResponse } from "next/server";

/**
 * Create a new business or update an existing one based on the ownerId. If a business with the given ownerId already exists, it will be updated with the new details. If not, a new business will be created.
 */
export async function POST(request: Request) {
  try {
    const { businessName, ownerId, supportEmail, apiKey } = (await request.json()) as {
      ownerId: string;
      businessName: string;
      supportEmail: string;
      apiKey: string;
    };

    if (!ownerId || !businessName || !supportEmail || !apiKey) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    await db_connection();

    const business = await BusinessModel.findOneAndUpdate(
      { ownerId },
      { businessName, supportEmail, apiKey },
      { new: true, upsert: true },
    );

    return NextResponse.json(
      { success: true, message: "Business created/updated successfully", business },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to create/update business", error },
      { status: 500 },
    );
  }
}


