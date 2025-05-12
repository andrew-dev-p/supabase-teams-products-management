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

  if (req.method !== "PATCH") {
    return handleError("Method Not Allowed", 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return handleError("Invalid JSON", 400);
  }

  const { userId, name, email, profile_picture } = body;

  const { data, error } = await supabase
    .from("users")
    .update({
      name,
      email,
      profile_picture,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    return handleError(error.message, 400);
  }

  return handleResponse(data, 200);
});
