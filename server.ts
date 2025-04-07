import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEFAULT_IMPORT_MAP_PATH = "default-import-map.json";
const IMPORT_MAP_PATH = "/import-map.json";

export async function handler(req: Request) {
  if (req.method === "GET" && req.url.pathname === IMPORT_MAP_PATH) {
    const importMap = Deno.readTextFileSync(DEFAULT_IMPORT_MAP_PATH);
    return new Response(importMap, {
      headers: {
        "content-type": "application/json"
      }
    });
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 8000 });
