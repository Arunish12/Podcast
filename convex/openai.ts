import { action } from "./_generated/server";
import { v } from "convex/values";

import OpenAI from "openai";
import { SpeechCreateParams } from "openai/resources/audio/speech.mjs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const generateAudioAction = action({
  args: { input: v.string(), voice: v.string() },
  handler: async (_, { voice, input }) => {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice as SpeechCreateParams['voice'],
      input,
    });

    const buffer = await mp3.arrayBuffer();
    
    return buffer;
  },
});

export const generateThumbnailAction = action({
  args: { prompt: v.string() },
  handler: async (_, { prompt }) => {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const url = response.data[0].url;

    if(!url) {
      throw new Error('Error generating thumbnail');
    }

    const imageResponse = await fetch(url);
    const buffer = await imageResponse.arrayBuffer();
    return buffer;
  }
})

export const generateSummaryAction = action({
  args: { text: v.string() },
  handler: async (_, { text }) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Summarize the provided text for a second-grade student.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const summary = response.choices[0]?.message?.content?.trim();
      
      if (!summary) {
        throw new Error("Failed to generate summary.");
      }

      return summary;
    } catch (error: any) {
      console.error("Summary generation error:", error);
      throw new Error("Error generating summary. Please try again.");
    }
  },
});
