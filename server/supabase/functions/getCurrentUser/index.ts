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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return createResponse({ message: "Authorization header required" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError) {
    return createResponse({ message: authError.message }, 401);
  }

  if (!authUser) {
    return createResponse({ message: "User not found" }, 404);
  }

  const { data: profileUser, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    return createResponse({ message: profileError.message }, 404);
  }

  if (!profileUser) {
    return createResponse({ message: "User profile not found" }, 404);
  }

  return createResponse(profileUser, 200);
});
