import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { listChatbots, serializeBot } from "@/lib/chatbots";
import { ChatbotModel } from "@/models/chatbot.model";
import { NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

// List every chatbot owned by the current account.
export async function GET() {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const bots = await listChatbots(owner.ownerId);
  return NextResponse.json({ success: true, bots });
}

// Create a new draft chatbot with sensible defaults.
export async function POST() {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  await db_connection();
  const bot = await ChatbotModel.create({
    ownerId: owner.ownerId,
    name: "Untitled chatbot",
    status: "draft",
    supportEmail: owner.email,
  });

  return NextResponse.json({ success: true, bot: serializeBot(bot.toObject()) }, { status: 201 });
}
