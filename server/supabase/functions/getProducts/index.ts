import {
  handleResponse,
  handleOptionsRequest,
  handleError,
} from "../_shared/cors.ts";
import { createSupabaseClient } from "../_shared/supabase.ts";

const supabase = createSupabaseClient();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return handleOptionsRequest();
  }

  if (req.method !== "GET") {
    return handleError("Method not allowed", 405);
  }

  const url = new URL(req.url);
  const teamId = url.searchParams.get("team_id");
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = parseInt(url.searchParams.get("per_page") || "10");

  if (!teamId) {
    return handleError("Missing team_id parameter", 400);
  }

  if (isNaN(page) || page < 1) {
    return handleError("Invalid page parameter", 400);
  }

  if (isNaN(perPage) || perPage < 1) {
    return handleError("Invalid per_page parameter", 400);
  }

  let query = supabase
    .from("products")
    .select(
      `
      id,
      title,
      description,
      picture,
      status,
      created_at,
      team_id
    `
    )
    .eq("team_id", teamId);

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  // First get the total count of items that match the query
  const { count: totalCount } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("team_id", teamId);

  if (totalCount === null) {
    return handleError("Failed to get total count", 500);
  }

  const totalPages = Math.ceil(totalCount / perPage);

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  query = query
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: products, error } = await query;

  if (error) {
    return handleError(error.message, 400);
  }

  return handleResponse(
    {
      products,
      totalPages,
    },
    200
  );
});
