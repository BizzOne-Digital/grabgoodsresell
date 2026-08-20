import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PageContentSchema = new Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ["home", "about", "contact", "booking", "pricing"],
      index: true,
    },
    content: { type: Schema.Types.Mixed, default: {} },
    draftContent: { type: Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: true },
    seo: {
      title: String,
      description: String,
    },
  },
  { timestamps: true },
);

export type PageContentDocument = InferSchemaType<typeof PageContentSchema> & {
  _id: mongoose.Types.ObjectId;
};

const PageContent =
  (mongoose.models.PageContent as Model<PageContentDocument>) ||
  mongoose.model<PageContentDocument>("PageContent", PageContentSchema);

export default PageContent;
