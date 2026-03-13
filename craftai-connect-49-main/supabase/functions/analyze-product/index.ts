import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const { imageBase64, voiceText } = await req.json();

    /* ---------------- VISION ANALYSIS ---------------- */

    const visionPrompt = `
Analyze this product image in detail and extract:

- object type (e.g., clay pot, woven basket, necklace)
- material (e.g., terracotta, brass, cotton)
- craft category (e.g., pottery, textiles, jewelry, basketry, woodwork, metalwork)
- colors (list the main colors)
- style (e.g., handmade rustic, polished modern, traditional)
- possible craft origin (e.g., Jaipur blue pottery, Banarasi weaving)

Return ONLY valid JSON with keys:
object, material, craft, colors, style, origin
`;

    const visionResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: visionPrompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error("Vision API error:", errorText);
      throw new Error("Vision analysis failed");
    }

    const visionData = await visionResponse.json();

    const visionText =
      visionData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    /* ---------------- LISTING GENERATION ---------------- */

    const voiceContext = voiceText
      ? `\nThe artisan also shared this about their product: "${voiceText}"`
      : "";

    const listingPrompt = `
You are an expert handicraft marketplace assistant.

Using the following product analysis, generate a marketplace listing.

Product analysis:
${visionText}
${voiceContext}

Return ONLY valid JSON with these keys:

{
"title": "",
"description": "",
"story": "",
"priceMin": number,
"priceMax": number,
"tags": []
}

Rules:
- Title: 5–10 words
- Description: 100–150 words
- Story: 80–120 words about cultural heritage
- Price: realistic Indian handicraft market price
- Tags: 6–8 SEO keywords
`;

    const listingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: listingPrompt }],
            },
          ],
        }),
      }
    );

    if (!listingResponse.ok) {
      const errorText = await listingResponse.text();
      console.error("Listing generation error:", errorText);
      throw new Error("Listing generation failed");
    }

    const listingData = await listingResponse.json();

    const listingText =
      listingData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    /* ---------------- PARSE LISTING ---------------- */

    let listing;

    try {
      const cleaned = listingText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      listing = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse listing JSON:", listingText);

      listing = {
        title: "Handcrafted Product",
        description: listingText,
        story: "",
        priceMin: 500,
        priceMax: 2000,
        tags: [],
      };
    }

    /* ---------------- PARSE VISION ---------------- */

    let vision;

    try {
      const cleanedVision = visionText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      vision = JSON.parse(cleanedVision);
    } catch {
      vision = { raw: visionText };
    }

    return new Response(
      JSON.stringify({ listing, vision }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("analyze-product error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});