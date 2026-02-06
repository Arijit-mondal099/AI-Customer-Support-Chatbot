import { model, models, Schema } from "mongoose";

export interface IBusiness {
  ownerId: string;
  businessName: string;
  supportEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    ownerId: { type: String, required: true, unique: true },
    businessName: { type: String, required: true, lowercase: true, trim: true },
    supportEmail: { type: String, required: true, lowercase: true, trim: true, unique: true },
  },
  { timestamps: true },
);

export const BusinessModel = models.Business || model<IBusiness>("Business", businessSchema);
