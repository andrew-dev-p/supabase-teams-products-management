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

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

export { client };
