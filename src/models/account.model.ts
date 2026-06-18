import { model, models, Schema } from "mongoose";

export interface IAccount {
  ownerId: string;
  email: string;
  apiKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>(
  {
    ownerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    apiKey: { type: String, default: "" },
  },
  { timestamps: true },
);

export const AccountModel = models.Account || model<IAccount>("Account", accountSchema);
