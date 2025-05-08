import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const teamId = url.searchParams.get("team_id");
  const search = url.searchParams.get("search");

  if (!teamId) {
    return new Response("Missing team_id parameter", { status: 400 });
  }

  let query = supabase
    .from("products")
    .select(
      `
      id,
      title,
      description,
      picture,
      status,
      created_at,
      team_id
    `
    )
    .eq("team_id", teamId);

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
});
