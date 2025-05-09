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
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = parseInt(url.searchParams.get("per_page") || "10");

  if (!teamId) {
    return new Response("Missing team_id parameter", { status: 400 });
  }

  if (isNaN(page) || page < 1) {
    return new Response("Invalid page parameter", { status: 400 });
  }

  if (isNaN(perPage) || perPage < 1) {
    return new Response("Invalid per_page parameter", { status: 400 });
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

  if (status) {
    query = query.eq("status", status);
  }

  // First get the total count of items that match the query
  const { count: totalCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (totalCount === null) {
    return new Response("Failed to get total count", { status: 500 });
  }

  const totalPages = Math.ceil(totalCount / perPage);

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  query = query
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: products, error } = await query;

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify({
      products,
      totalPages,
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }
  );
});
