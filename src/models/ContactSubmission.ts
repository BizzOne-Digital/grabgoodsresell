import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ContactSubmissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ContactSubmissionDocument = InferSchemaType<
  typeof ContactSubmissionSchema
> & {
  _id: mongoose.Types.ObjectId;
};

const ContactSubmission =
  (mongoose.models.ContactSubmission as Model<ContactSubmissionDocument>) ||
  mongoose.model<ContactSubmissionDocument>(
    "ContactSubmission",
    ContactSubmissionSchema,
  );

export default ContactSubmission;
