import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

const createResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "PATCH") {
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return createResponse("Invalid JSON", 400);
  }

  const { userId, name, email, profile_picture } = body;

  const { data, error } = await supabase
    .from("users")
    .update({
      name,
      email,
      profile_picture,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return createResponse({ message: error.message }, 400);
  }

  return createResponse(data, 200);
});
