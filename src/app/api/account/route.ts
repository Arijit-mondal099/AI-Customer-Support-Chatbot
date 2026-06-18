import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { AccountModel } from "@/models/account.model";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const maskKey = (key?: string): string => {
  if (!key) return "";
  if (key.length <= 4) return "••••";
  return `${"•".repeat(Math.min(key.length - 4, 24))}${key.slice(-4)}`;
};

// Read the account, lazily creating it from the session on first visit.
export async function GET() {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  await db_connection();
  let account = await AccountModel.findOne({ ownerId: owner.ownerId });
  if (!account) {
    account = await AccountModel.create({ ownerId: owner.ownerId, email: owner.email });
  }

  return NextResponse.json({
    success: true,
    account: {
      email: account.email,
      hasApiKey: !!account.apiKey,
      apiKeyMasked: maskKey(account.apiKey),
    },
  });
}

// Update the account-level Gemini API key (reused by all of this owner's bots).
export async function PUT(request: NextRequest) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const { apiKey } = (await request.json()) as { apiKey?: string };

  await db_connection();
  const account = await AccountModel.findOneAndUpdate(
    { ownerId: owner.ownerId },
    { ownerId: owner.ownerId, email: owner.email, apiKey: apiKey?.trim() ?? "" },
    { new: true, upsert: true },
  );

  return NextResponse.json({
    success: true,
    message: "API key saved",
    account: {
      email: account.email,
      hasApiKey: !!account.apiKey,
      apiKeyMasked: maskKey(account.apiKey),
    },
  });
}
