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

  if (req.method !== "POST") {
    return handleError("Method Not Allowed", 405);
  }

  try {
    const { userId, slug } = await req.json();

    if (!userId || !slug) {
      return handleError("userId and slug are required", 400);
    }

    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", slug)
      .single();

    if (teamError) {
      return handleError(teamError.message, 400);
    }

    if (!teamData) {
      return handleError("Team not found", 404);
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ team_id: teamData.id })
      .eq("id", userId);

    if (updateError) {
      return handleError(updateError.message, 400);
    }

    return handleResponse({ message: "Successfully joined team" }, 200);
  } catch (error) {
    return handleError(error.message, 500);
  }
});
