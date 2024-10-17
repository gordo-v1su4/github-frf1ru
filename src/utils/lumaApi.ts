import { LumaAI } from 'lumaai';

const client = new LumaAI({
  authToken: import.meta.env.VITE_LUMAAI_API_KEY
});

export async function generateLumaVideo(imageUrl: string, prompt: string): Promise<string> {
  try {
    console.log('Sending request to Luma API:', { imageUrl, prompt });

    const generation = await client.generations.create({
      prompt: prompt,
      keyframes: {
        frame0: {
          type: "image",
          url: imageUrl
        }
      }
    });

    console.log('Generation started:', generation);

    let completed = false;
    let videoUrl = '';

    while (!completed) {
      if (!generation.id) {
        throw new Error('Generation ID is undefined');
      }

      const status = await client.generations.get(generation.id);
      console.log('Generation status:', status);

      if (status.state === "completed") {
        completed = true;
        if (status.assets?.video) {
          videoUrl = status.assets.video;
        } else {
          throw new Error('Video URL is missing from completed generation');
        }
      } else if (status.state === "failed") {
        throw new Error(`Generation failed: ${status.failure_reason}`);
      } else {
        console.log("Dreaming...");
        await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
      }
    }

    console.log('Video generation completed:', videoUrl);
    return videoUrl;
  } catch (error) {
    console.error('Error in generateLumaVideo:', error);
    throw error;
  }
}