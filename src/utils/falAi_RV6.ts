import * as fal from "@fal-ai/serverless-client";

fal.config({
  credentials: "62622917-b6f0-44ab-b8ec-b7a6e9a866ed:c341075bd7698ea73364b8619578cf59",
});

interface ImageResult {
  images: { url: string }[];
}

interface VideoResult {
  video: { url: string };
}

export async function generateImages(prompt: string): Promise<string[]> {
  try {
    const result = await fal.subscribe("fal-ai/realistic-vision", {
      input: {
        loras: [
          {
            path: "https://civitai.com/api/download/models/62833?type=Model&format=SafeTensor",
            scale: 1
          }
        ],
        format: "png",
        prompt: prompt,
        embeddings: [],
        image_size: "landscape_16_9",
        model_name: "SG161222/Realistic_Vision_V6.0_B1_noVAE",
        num_images: 8,
        expand_prompt: true,
        guidance_scale: 5,
        negative_prompt: "nsfw, (deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), camera, text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, UnrealisticDream",
        num_inference_steps: 35,
        enable_safety_checker: true,
        safety_checker_version: "v1"
      },
      logs: true,
      onQueueUpdate: (status) => {
        console.log("Queue status:", status);
      },
    }) as ImageResult;

    if (result && 'images' in result && Array.isArray(result.images)) {
      return result.images.map(image => image.url);
    } else {
      throw new Error('Unexpected result format');
    }
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}

export async function generateVideo(prompt: string, imageUrl: string): Promise<string> {
  try {
    const result = await fal.subscribe("fal-ai/runway-gen3/turbo/image-to-video", {
      input: {
        prompt: prompt,
        image_url: imageUrl
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    }) as VideoResult;

    if (result && 'video' in result && 'url' in result.video) {
      return result.video.url;
    } else {
      throw new Error('Unexpected video result format');
    }
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
}