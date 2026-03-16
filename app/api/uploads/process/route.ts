// {
//   propertyId: string,
//   fileKey: string, // path of original in S3
//   isPrimary?: boolean
// }

// /app/api/uploads/process/route.ts

import { NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { processImage } from "@/lib/imageProcessor";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma"; // adjust if needed
import { checkIfLoggedIn, checkIfHostOfProperty } from "@/lib/jwt";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    const user = await checkIfLoggedIn(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, fileKey } = await req.json();

    if (!propertyId || !fileKey) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // check if user is host of property
    const isHostOfProperty = await checkIfHostOfProperty(user, propertyId);
    if (!isHostOfProperty) {
      return NextResponse.json(
        { error: "User is not owner of this property" },
        { status: 400 },
      );
    }

    // download original from S3
    const getObject = await s3.send(
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: fileKey,
      }),
    );

    // ensure body exists
    if (!getObject.Body) {
      return NextResponse.json(
        { error: "Failed to download image" },
        { status: 500 },
      );
    }

    const stream = getObject.Body as Readable;

    const chunks: Buffer[] = [];

    // convert stream to buffer
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

    // build CloudFront URLs
    const cdn = process.env.CLOUDFRONT_URL;
    const optimizedUrl = `${cdn}/${optimizedKey}`;
    const thumbnailUrl = `${cdn}/${thumbKey}`;

    // save to DB
    await prisma.propertyphotos.create({
      data: {
        propertyid: propertyId,
        photourl: optimizedUrl,
        // thumbnailurl, TODO: add this column to db
        // isPrimary: isPrimary ?? false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
