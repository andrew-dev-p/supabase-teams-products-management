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
    return handleError("Method not allowed", 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return handleError("Invalid JSON", 400);
  }

  if (!payload?.email || !payload?.userId) {
    return handleError("Missing user data", 400);
  }

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        profile_picture: payload.profile_picture,
      },
    ])
    .select()
    .single();

  if (error) {
    return handleError(error.message, 400);
  }

  return handleResponse(data, 200);
});
