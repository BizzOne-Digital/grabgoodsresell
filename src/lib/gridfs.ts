import mongoose from "mongoose";
import connectDB from "@/lib/db";

const BUCKET_NAME = "uploads";

let bucket: mongoose.mongo.GridFSBucket | null = null;

export async function getGridFSBucket() {
  await connectDB();
  if (!bucket) {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
      bucketName: BUCKET_NAME,
    });
  }
  return bucket;
}

export function getImageUrl(fileId: string) {
  return `/api/images/${fileId}`;
}

export async function uploadToGridFS(
  buffer: Buffer,
  filename: string,
  contentType: string,
) {
  const bucket = await getGridFSBucket();

  return new Promise<{ fileId: string; filename: string }>(
    (resolve, reject) => {
      const uploadStream = bucket.openUploadStream(filename, {
        metadata: { uploadedAt: new Date(), contentType },
      });

      uploadStream.on("error", reject);
      uploadStream.on("finish", () => {
        resolve({
          fileId: uploadStream.id.toString(),
          filename,
        });
      });

      uploadStream.end(buffer);
    },
  );
}

export async function deleteFromGridFS(fileId: string) {
  const bucket = await getGridFSBucket();
  await bucket.delete(new mongoose.Types.ObjectId(fileId));
}

export async function getFileMetadata(fileId: string) {
  const bucket = await getGridFSBucket();
  const files = await bucket
    .find({ _id: new mongoose.Types.ObjectId(fileId) })
    .toArray();
  return files[0] ?? null;
}

export async function openDownloadStream(fileId: string) {
  const bucket = await getGridFSBucket();
  return bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
}
