import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEFAULT_IMPORT_MAP_PATH = "default-import-map.json";
const IMPORT_MAP_PATH = "/my-app/import-map.json";

export async function handler(req: Request) {
  if (req.method === "GET" && req.url === IMPORT_MAP_PATH) {
    try {
      const importMap = Deno.readTextFileSync(DEFAULT_IMPORT_MAP_PATH);
      return new Response(importMap, {
        headers: {
          "content-type": "application/json"
        }
      });
    } catch (error) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 8000 });
