import { createClient } from "https://esm.sh/@supabase/supabase-js";
import {
  handleOptionsRequest,
  handleError,
  handleResponse,
} from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  if (req.method !== "GET") {
    return handleError("Method Not Allowed", 405);
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return handleError("Slug is required", 400);
  }

  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select(`*`)
    .eq("slug", slug)
    .single();

  if (teamError) {
    return handleError(teamError.message, 400);
  }

  if (!teamData) {
    return handleError("Team not found", 404);
  }

  return handleResponse(teamData, 200);
});
