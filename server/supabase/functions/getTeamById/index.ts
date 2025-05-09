// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "GET") {
    return createResponse({ message: "Method Not Allowed" }, 405);
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return createResponse({ message: "ID is required" }, 400);
  }

  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select(`*`)
    .eq("id", id)
    .single();

  if (teamError) {
    return createResponse({ message: teamError.message }, 400);
  }

  if (!teamData) {
    return createResponse({ message: "Team not found" }, 404);
  }

  return createResponse(teamData, 200);
});
