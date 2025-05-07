import axios from "axios";
import { createClient } from "./supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const client = axios.create({
  baseURL: API_URL,
});

const supabase = createClient();

client.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  if (
    config.method &&
    ["post", "put", "patch"].includes(config.method) &&
    config.data
  ) {
    const userId = user?.id;

    if (userId) {
      config.data = {
        ...config.data,
        userId,
      };
    }
  }

  return config;
});

export { client };
