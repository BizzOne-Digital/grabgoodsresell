import { apiError, apiSuccess } from "@/lib/api-helpers";
import { contactSchema } from "@/lib/validations";
import connectDB from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body", 400);
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map((issue) => issue.message).join(", ");
      return apiError(message, 400);
    }

    await connectDB();

    const submission = await ContactSubmission.create(parsed.data);

    return apiSuccess(
      {
        message: "Thank you for your message. We will get back to you soon.",
        id: submission._id.toString(),
      },
      201,
    );
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return apiError("Failed to submit contact form", 500);
  }
}
