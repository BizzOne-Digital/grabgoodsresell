import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const TestimonialSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    testimonial: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    date: { type: Date, default: Date.now },
    image: { type: String },
    published: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type TestimonialDocument = InferSchemaType<typeof TestimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Testimonial =
  (mongoose.models.Testimonial as Model<TestimonialDocument>) ||
  mongoose.model<TestimonialDocument>("Testimonial", TestimonialSchema);

export default Testimonial;
