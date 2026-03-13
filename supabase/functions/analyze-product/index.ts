import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

<<<<<<< HEAD
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

=======
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
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
<<<<<<< HEAD
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const { imageBase64, voiceText } = await req.json();

    /* ---------------- VISION ANALYSIS ---------------- */

    const visionPrompt = `
Analyze this product image in detail and extract:

=======
    const { imageBase64, voiceText } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Step 1: Vision analysis — send image to Gemini for object/material/color detection
    const visionPrompt = `Analyze this product image in detail. Extract:
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
- object type (e.g., clay pot, woven basket, necklace)
- material (e.g., terracotta, brass, cotton)
- craft category (e.g., pottery, textiles, jewelry, basketry, woodwork, metalwork)
- colors (list the main colors)
- style (e.g., handmade rustic, polished modern, traditional)
- possible craft origin (e.g., Jaipur blue pottery, Banarasi weaving)

<<<<<<< HEAD
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
=======
Return ONLY valid JSON with keys: object, material, craft, colors, style, origin`;

    const visionResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: visionPrompt },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
<<<<<<< HEAD
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
=======
      console.error("Vision API error:", visionResponse.status, errorText);
      if (visionResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (visionResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Vision analysis failed: ${visionResponse.status}`);
    }

    const visionData = await visionResponse.json();
    const visionText = visionData.choices?.[0]?.message?.content ?? "";

    // Step 2: Generate the full listing using the vision analysis + optional voice input
    const voiceContext = voiceText
      ? `\n\nThe artisan also shared this about their product: "${voiceText}"`
      : "";

    const listingPrompt = `You are an expert handicraft marketplace assistant.

Based on the following product analysis, generate a complete marketplace listing.
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae

Product analysis:
${visionText}
${voiceContext}

<<<<<<< HEAD
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
=======
Generate the following as valid JSON with these exact keys:
1. "title" — short, attractive product title (5-10 words)
2. "description" — detailed product description (100-150 words) highlighting craftsmanship, materials, and uniqueness
3. "story" — a cultural story about this craft tradition (80-120 words), its history, regional significance, and the artisans who keep it alive
4. "priceMin" — suggested minimum price in INR (number only)
5. "priceMax" — suggested maximum price in INR (number only)
6. "tags" — array of 6-8 SEO keyword tags

The tone should highlight craftsmanship, tradition, and uniqueness. Prices should reflect realistic Indian handicraft market rates considering material value and craftsmanship complexity.

Return ONLY valid JSON, no markdown.`;

    const listingResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a helpful handicraft marketplace AI. Always respond with valid JSON only." },
            { role: "user", content: listingPrompt },
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
          ],
        }),
      }
    );

    if (!listingResponse.ok) {
      const errorText = await listingResponse.text();
<<<<<<< HEAD
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

=======
      console.error("Listing generation error:", listingResponse.status, errorText);
      if (listingResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Listing generation failed: ${listingResponse.status}`);
    }

    const listingData = await listingResponse.json();
    const listingText = listingData.choices?.[0]?.message?.content ?? "";

    // Parse the JSON from the AI response
    let listing;
    try {
      // Strip markdown code fences if present
      const cleaned = listingText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      listing = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse listing JSON:", listingText);
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
      listing = {
        title: "Handcrafted Product",
        description: listingText,
        story: "",
        priceMin: 500,
        priceMax: 2000,
        tags: [],
      };
    }

<<<<<<< HEAD
    /* ---------------- PARSE VISION ---------------- */

    let vision;

    try {
      const cleanedVision = visionText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

=======
    // Parse vision analysis too
    let vision;
    try {
      const cleanedVision = visionText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
      vision = JSON.parse(cleanedVision);
    } catch {
      vision = { raw: visionText };
    }

    return new Response(
      JSON.stringify({ listing, vision }),
<<<<<<< HEAD
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
=======
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-product error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
>>>>>>> deccab569bc3f2f6cb81019ee5a24d66a8b3b5ae
