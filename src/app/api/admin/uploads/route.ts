import { NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-helpers";
import { uploadToGridFS, deleteFromGridFS, getImageUrl } from "@/lib/gridfs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return apiError("No file provided", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return apiError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError("File too large. Maximum size is 5MB", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadToGridFS(buffer, file.name, file.type);

    return apiSuccess(
      {
        fileId: result.fileId,
        filename: result.filename,
        url: getImageUrl(result.fileId),
        contentType: file.type,
        size: file.size,
      },
      201,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to upload file", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdminSession();

    const fileId = new URL(request.url).searchParams.get("fileId");

    if (!fileId) {
      return apiError("fileId query parameter is required", 400);
    }

    await deleteFromGridFS(fileId);

    return apiSuccess({ deleted: true, fileId });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return apiError("Failed to delete file", 500);
  }
}
