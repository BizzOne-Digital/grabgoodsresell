import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const FAQSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    published: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export type FAQDocument = InferSchemaType<typeof FAQSchema> & {
  _id: mongoose.Types.ObjectId;
};

const FAQ =
  (mongoose.models.FAQ as Model<FAQDocument>) ||
  mongoose.model<FAQDocument>("FAQ", FAQSchema);

export default FAQ;
