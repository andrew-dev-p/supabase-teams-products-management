import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { handleError, handleResponse } from "../_shared/cors.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return handleError("Method Not Allowed", 405);
  }

  const { data, error } = await supabase.from("users").select("*");

  if (error) return handleError(error.message, 400);

  return handleResponse(data, 200);
});
