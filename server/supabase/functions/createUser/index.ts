import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

// Set up CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

// Helper for consistent response creation
const createResponse = (body: unknown, status: number) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
};

Deno.serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return createResponse({ error: "Method not allowed" }, 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return createResponse({ error: "Invalid JSON" }, 400);
  }

  if (!payload?.email || !payload?.userId) {
    return createResponse({ error: "Missing user data" }, 400);
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        profile_picture: payload.profile_picture,
      },
    ])
    .select()
    .single();

  if (error) {
    return createResponse({ error: error.message }, 400);
  }

  return createResponse(data, 200);
});
