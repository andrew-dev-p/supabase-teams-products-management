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

  if (req.method !== "POST") {
    return handleError("Method not allowed", 405);
  }

  try {
    const { productId } = await req.json();

    if (!productId) {
      return handleError("Missing productId", 400);
    }

    const { error } = await supabase
      .from("products")
      .update({
        status: "deleted",
        deleted_at: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 2
        ).toISOString(),
      })
      .eq("id", productId);

    if (error) {
      return handleError(error.message, 400);
    }

    return handleResponse({ success: true }, 200);
  } catch (error) {
    return handleError(error.message, 400);
  }
});
