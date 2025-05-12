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
  const teamId = url.searchParams.get("teamId");

  if (!teamId) {
    return handleError("Team ID is required", 400);
  }

  const { data: teamData, error: teamError } = await supabase
    .from("users")
    .select("*")
    .eq("team_id", teamId);

  if (teamError) {
    return handleError(teamError.message, 400);
  }

  if (!teamData) {
    return handleError("Users not found", 404);
  }

  return handleResponse(teamData, 200);
});
