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

  if (req.method !== "PATCH") {
    return handleError("Method Not Allowed", 405);
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return handleError("Invalid JSON", 400);
  }

  const product = payload.product;

  if (!product?.id) {
    return handleError("Missing product ID", 400);
  }

  const { data: _productData, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", product.id)
    .single();

  if (productError) {
    return handleError("Product not found", 404);
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      title: product.title,
      description: product.description,
      picture: product.picture,
      status: product.status,
      deleted_at:
        product.status === "active" || product.status === "draft"
          ? null
          : undefined,
    })
    .eq("id", product.id);

  if (updateError) {
    return handleError("Failed to update product", 500);
  }

  return handleResponse({ success: true }, 200);
});
