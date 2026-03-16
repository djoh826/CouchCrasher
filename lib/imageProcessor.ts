import sharp from "sharp";

export interface ProcessedImages {
  optimizedBuffer: Buffer;
  thumbnailBuffer: Buffer;
}

export async function processImage(
  inputBuffer: Buffer,
): Promise<ProcessedImages> {
  // Optimized version (max 1600px width)
  const optimizedBuffer = await sharp(inputBuffer)
    .resize({
      width: 1600,
      withoutEnlargement: true, // dont upscale small images
    })
    .webp({
      quality: 80,
    })
    .toBuffer();

  // Thumbnail version (400px width)
  const thumbnailBuffer = await sharp(inputBuffer)
    .resize({
      width: 400,
      withoutEnlargement: true,
    })
    .webp({
      quality: 80,
    })
    .toBuffer();

  return {
    optimizedBuffer,
    thumbnailBuffer,
  };
}
