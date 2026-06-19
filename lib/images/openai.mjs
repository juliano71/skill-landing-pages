export async function generateOpenAIImage({ prompt, size = "1024x1024", apiKey, fetchImpl = fetch }) {
  if (!apiKey) throw new Error("apiKey ausente: defina OPENAI_API_KEY no .env");
  const res = await fetchImpl("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, size, n: 1 }),
  });
  if (!res.ok) throw new Error(`OpenAI image falhou: HTTP ${res.status}`);
  const json = await res.json();
  return { b64: json.data[0].b64_json };
}
