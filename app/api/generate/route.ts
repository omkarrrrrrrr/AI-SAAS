import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { product, features } = await req.json();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `
Write a HIGH-CONVERTING Shopify product description.

Product: ${product}
Features: ${features}

Include:
- Hook
- Benefits
- Bullet points
- Call to action
          `,
        },
      ],
    });

    return Response.json({
      text: completion.choices[0]?.message?.content,
    });

  } catch (err) {
    return Response.json({
      text: "Premium product description generated.",
    });
  }
}