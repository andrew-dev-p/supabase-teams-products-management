export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

export const handleResponse = (body: unknown, status: number) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
};

export const handleOptionsRequest = () => {
  return new Response(null, {
    headers: corsHeaders,
  });
};

export const handleError = (message: string, status: number = 400) => {
  return handleResponse({ error: message }, status);
};
