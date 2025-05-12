import {
  handleOptionsRequest,
  handleError,
  handleResponse,
} from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase.ts";

const supabase = createSupabaseClient();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  if (req.method !== "POST") {
    return handleError("Method Not Allowed", 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return handleError("Invalid JSON", 400);
  }

  const { name, slug, userId } = body;

  if (!name) {
    return handleError("Missing required field: name", 400);
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
    return handleError(teamError.message, 400);
  }

  const { error: userError } = await supabase
    .from("users")
    .update({ team_id: teamData.id })
    .eq("id", userId);

  if (userError) {
    return handleError(userError.message, 400);
  }

  return handleResponse(teamData, 201);
});
