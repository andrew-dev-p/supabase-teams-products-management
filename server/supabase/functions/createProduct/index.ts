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
    return handleError("Method not allowed", 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return handleError("Invalid JSON", 400);
  }

  const product = payload.product;

  if (!product?.title || !product?.description || !product?.team_id) {
    return handleError("Missing product data", 400);
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        title: product.title,
        description: product.description,
        picture: product.picture,
        team_id: product.team_id,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) return handleError(error.message, 400);

  return handleResponse(data, 200);
});
