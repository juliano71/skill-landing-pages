import { generateOpenAIImage } from "./openai.mjs";

// huggsfield é chamado em runtime pela skill via ferramentas MCP (ver references/image-providers.md).
export async function generateImage({ provider = "openai", prompt, size, apiKey }) {
  if (provider === "openai") return generateOpenAIImage({ prompt, size, apiKey });
  throw new Error(`provider '${provider}' não suportado neste script (use a skill p/ huggsfield)`);
}
