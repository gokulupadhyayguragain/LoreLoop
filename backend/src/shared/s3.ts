import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getConfig } from "./config";

const config = getConfig();
const client = new S3Client({ region: config.region });

export interface StoredArtwork {
  key: string;
  url?: string;
}

export async function storeArtwork(id: string, generatedAt: string, image: Buffer): Promise<StoredArtwork> {
  if (!config.artworkBucketName) throw new Error("ARTWORK_BUCKET_NAME is required for artwork storage.");
  const date = new Date(generatedAt);
  const key = `lore/${date.getUTCFullYear()}/${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}/${id}.png`;
  await client.send(new PutObjectCommand({
    Bucket: config.artworkBucketName,
    Key: key,
    Body: image,
    ContentType: "image/png",
    CacheControl: "public,max-age=31536000,immutable",
  }));
  const url = config.artworkUrlBase ? `${config.artworkUrlBase.replace(/\/$/, "")}/${key}` : undefined;
  return { key, url };
}

export async function getArtworkUrl(key: string): Promise<string> {
  if (!config.artworkBucketName) throw new Error("ARTWORK_BUCKET_NAME is required for artwork delivery.");
  return getSignedUrl(client, new GetObjectCommand({ Bucket: config.artworkBucketName, Key: key }), { expiresIn: 3600 });
}
