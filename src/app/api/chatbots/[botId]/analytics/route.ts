import { requireOwner } from "@/lib/auth";
import { db_connection } from "@/lib/db";
import { ChatbotModel } from "@/models/chatbot.model";
import { ConversationModel } from "@/models/conversation.model";
import { MessageModel } from "@/models/message.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{ botId: string }>;
}

const unauthorized = () =>
  NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

const notFound = () =>
  NextResponse.json({ success: false, message: "Chatbot not found" }, { status: 404 });

export async function GET(_request: NextRequest, { params }: Params) {
  const owner = await requireOwner();
  if (!owner) return unauthorized();

  const { botId } = await params;
  if (!isValidObjectId(botId)) return notFound();

  await db_connection();
  const bot = await ChatbotModel.findOne({ _id: botId, ownerId: owner.ownerId }).select("_id");
  if (!bot) return notFound();

  const [conversations, messages, latest] = await Promise.all([
    ConversationModel.countDocuments({ botId }),
    MessageModel.countDocuments({ botId }),
    ConversationModel.findOne({ botId }).sort({ lastMessageAt: -1 }).select("lastMessageAt").lean(),
  ]);

  return NextResponse.json({
    success: true,
    analytics: {
      conversations,
      messages,
      lastActiveAt: latest?.lastMessageAt ? new Date(latest.lastMessageAt).toISOString() : null,
    },
  });
}
