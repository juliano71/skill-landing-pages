import { describe, it, expect } from "vitest";
import { generateOpenAIImage } from "@/lib/images/openai.mjs";

describe("generateOpenAIImage", () => {
  it("monta a requisição correta e retorna b64", async () => {
    let captured;
    const fakeFetch = async (url, opts) => {
      captured = { url, opts };
      return { ok: true, json: async () => ({ data: [{ b64_json: "ABC123" }] }) };
    };
    const res = await generateOpenAIImage({ prompt: "hero vinho", apiKey: "sk-test", fetchImpl: fakeFetch });
    expect(res.b64).toBe("ABC123");
    expect(captured.url).toBe("https://api.openai.com/v1/images/generations");
    expect(JSON.parse(captured.opts.body).model).toBe("gpt-image-1");
    expect(captured.opts.headers.Authorization).toBe("Bearer sk-test");
  });

  it("lança erro se faltar apiKey", async () => {
    await expect(generateOpenAIImage({ prompt: "x" })).rejects.toThrow(/apiKey/i);
  });
});
