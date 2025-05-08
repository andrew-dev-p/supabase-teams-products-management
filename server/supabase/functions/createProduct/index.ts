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
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const product = payload.product;

  if (
    !product?.title ||
    !product?.description ||
    !product?.picture ||
    !product?.team_id
  ) {
    return new Response("Missing product data", { status: 400 });
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

  if (error)
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
});
