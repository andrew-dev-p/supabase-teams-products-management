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
    return handleError("Method not allowed", 405);
  }

  try {
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("status", "deleted")
      .lte("deleted_at", new Date().toISOString());

    if (deleteError) {
      return handleError("Failed to delete products", 500);
    }

    return handleResponse({ success: true }, 200);
  } catch (error) {
    return handleError(error.message, 500);
  }
});
