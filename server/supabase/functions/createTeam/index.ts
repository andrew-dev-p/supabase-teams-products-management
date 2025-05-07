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
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { name, slug, userId } = body;

  if (!name) {
    return new Response("Missing required field: name", {
      status: 400,
    });
  }

  let managedSlug = slug;
  if (!slug) {
    const randomString = Math.random().toString(36).substring(2, 8);
    managedSlug = randomString;
  }

  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .insert([{ name, slug: managedSlug }])
    .select()
    .single();

  if (teamError) {
    return createResponse(teamError, 400);
  }

  const { error: userError } = await supabase
    .from("users")
    .update({ team_id: teamData.id })
    .eq("id", userId);

  if (userError) {
    return createResponse(userError, 400);
  }

  return createResponse(teamData, 201);
});
