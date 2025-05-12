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
