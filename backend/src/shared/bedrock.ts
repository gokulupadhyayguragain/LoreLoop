import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getConfig, requireTextModel } from "./config";
import { safeJsonParse } from "./validation";

const config = getConfig();
const client = new BedrockRuntimeClient({ region: config.region });
const imageClient = new BedrockRuntimeClient({ region: config.imageRegion });

interface NovaResponse {
  output?: { message?: { content?: Array<{ text?: string }> } };
  images?: string[];
}

export async function invokeText(prompt: string, maxTokens = 1400): Promise<string> {
  const modelId = requireTextModel(config);
  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { max_new_tokens: maxTokens, temperature: 0.82, top_p: 0.92 },
    }),
  });
  const response = await client.send(command);
  const parsed = JSON.parse(new TextDecoder().decode(response.body)) as NovaResponse;
  const text = parsed.output?.message?.content?.[0]?.text;
  if (!text) throw new Error("Bedrock returned an empty text response.");
  return text;
}

export async function invokeJson(prompt: string, maxTokens = 1400): Promise<unknown> {
  return safeJsonParse(await invokeText(prompt, maxTokens));
}

export async function invokeImage(prompt: string): Promise<Buffer> {
  if (!config.imageModelId) throw new Error("NOVA_IMAGE_MODEL_ID is required for artwork generation.");
  const isStabilityImage = config.imageModelId.startsWith("stability.");
  const command = new InvokeModelCommand({
    modelId: config.imageModelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(isStabilityImage ? {
      prompt,
      aspect_ratio: "1:1",
      output_format: "png",
    } : {
      taskType: "TEXT_IMAGE",
      textToImageParams: { text: prompt },
      imageGenerationConfig: { numberOfImages: 1, height: 1024, width: 1024, cfgScale: 7 },
    }),
  });
  const response = await imageClient.send(command);
  const parsed = JSON.parse(new TextDecoder().decode(response.body)) as NovaResponse;
  const image = parsed.images?.[0];
  if (!image) throw new Error(`${config.imageModelId} returned no image data.`);
  return Buffer.from(image, "base64");
}
