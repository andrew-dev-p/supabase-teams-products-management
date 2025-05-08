import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "PATCH") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const product = payload.product;

  if (!product?.id) {
    return new Response("Missing product ID", { status: 400 });
  }

  const { data: _productData, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("id", product.id)
    .single();

  if (productError) {
    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      title: product.title,
      description: product.description,
      picture: product.picture,
      status: product.status,
      deleted_at: product.status === 'active' || product.status === 'draft' ? null : undefined,
    })
    .eq("id", product.id);

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to update product" }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
});
