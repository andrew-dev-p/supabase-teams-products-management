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

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return handleError("Authorization header required", 401);
  }

  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError) {
    return handleError(authError.message, 401);
  }

  if (!authUser) {
    return handleError("User not found", 404);
  }

  const { data: profileUser, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (profileError) {
    return handleError(profileError.message, 404);
  }

  if (!profileUser) {
    return handleError("User profile not found", 404);
  }

  return handleResponse(profileUser, 200);
});
