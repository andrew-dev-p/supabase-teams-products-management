import { createSupabaseClient } from "../_shared/supabase.ts";
import {
  handleOptionsRequest,
  handleError,
  handleResponse,
} from "../_shared/cors.ts";

const supabase = createSupabaseClient();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  if (req.method !== "GET") {
    return handleError("Method Not Allowed", 405);
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return handleError("ID is required", 400);
  }

  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .select(`*`)
    .eq("id", id)
    .single();

  if (teamError) {
    return handleError(teamError.message, 400);
  }

  if (!teamData) {
    return handleError("Team not found", 404);
  }

  return handleResponse(teamData, 200);
});
