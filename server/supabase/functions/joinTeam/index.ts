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
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  try {
    const { userId, slug } = await req.json();

    if (!userId || !slug) {
      return createResponse({ message: "userId and slug are required" }, 400);
    }

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", slug)
      .single();

    if (teamError) {
      return createResponse({ message: teamError.message }, 400);
    }

    if (!teamData) {
      return createResponse({ message: "Team not found" }, 404);
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ team_id: teamData.id })
      .eq("id", userId);

    if (updateError) {
      return createResponse({ message: updateError.message }, 400);
    }

    return createResponse({ message: "Successfully joined team" }, 200);
  } catch (error) {
    return createResponse(
      {
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      500
    );
  }
});
