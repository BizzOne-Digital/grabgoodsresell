import mongoose from "mongoose";
import { Readable } from "node:stream";
import { getFileMetadata, openDownloadStream } from "@/lib/gridfs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid image ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const metadata = await getFileMetadata(id);

    if (!metadata) {
      return new Response(JSON.stringify({ error: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stream = await openDownloadStream(id);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    const fileMetadata = metadata as {
      contentType?: string;
      metadata?: { contentType?: string };
    };

    const contentType =
      fileMetadata.contentType ||
      fileMetadata.metadata?.contentType ||
      "application/octet-stream";

    return new Response(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(metadata.length != null
          ? { "Content-Length": String(metadata.length) }
          : {}),
      },
    });
  } catch (error) {
    console.error("GET /api/images/[id] error:", error);
    return new Response(JSON.stringify({ error: "Failed to load image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
