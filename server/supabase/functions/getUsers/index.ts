import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const { data, error } = await supabase.from("user").select("*");

  if (error) return new Response(JSON.stringify(error), { status: 400 });

  return new Response(JSON.stringify(data), { status: 200 });
});
