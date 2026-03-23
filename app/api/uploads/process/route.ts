// /app/api/uploads/process/route.ts

import { NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { processImage } from "@/lib/imageProcessor";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { checkIfLoggedIn, checkIfHostOfProperty } from "@/lib/jwt";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const user = await checkIfLoggedIn(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const photos: {
      propertyId: string;
      fileKey: string;
      isPrimary?: boolean;
      order?: number;
    }[] = await req.json();

    if (!Array.isArray(photos) || photos.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid data" },
        { status: 400 },
      );
    }

    const dbEntries = [];

    for (const photo of photos) {
      const { propertyId, fileKey, isPrimary, order } = photo;

      if (!propertyId || !fileKey) continue;

      // check if user is host of property
      const isHostOfProperty = await checkIfHostOfProperty(
        user,
        Number(propertyId),
      );
      if (!isHostOfProperty) continue;

      // download original from S3
      const getObject = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: fileKey,
        }),
      );

      if (!getObject.Body) continue;

      const stream = getObject.Body as Readable;
      const chunks: Buffer[] = [];

      for await (const chunk of stream) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }

      const originalBuffer = Buffer.concat(chunks);

      // process image
      const { optimizedBuffer, thumbnailBuffer } =
        await processImage(originalBuffer);

      // generate filenames
      const uuid = uuidv4();
      const optimizedKey = `properties/${propertyId}/optimized/${uuid}.webp`;
      const thumbKey = `properties/${propertyId}/thumb/${uuid}.webp`;

      // upload optimized
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: optimizedKey,
          Body: optimizedBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      // upload thumbnail
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: thumbKey,
          Body: thumbnailBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );

      const cdn = process.env.CLOUDFRONT_URL;
      dbEntries.push({
        propertyid: Number(propertyId),
        photourl: `${cdn}/${optimizedKey}`,
        thumbnailurl: `${cdn}/${thumbKey}`,
        isprimary: isPrimary ?? false,
        order: order ?? 1,
      });
    }

    if (dbEntries.length === 0) {
      return NextResponse.json(
        { error: "No valid images to process" },
        { status: 400 },
      );
    }

    // save all at once
    await prisma.propertyphotos.createMany({
      data: dbEntries,
      skipDuplicates: true, // optional
    });

    return NextResponse.json({ success: true, processed: dbEntries.length });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
