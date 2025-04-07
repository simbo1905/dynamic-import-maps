import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEFAULT_IMPORT_MAP_PATH = "default-import-map.json";
const IMPORT_MAP_PATH = "/my-app/import-map.json";

export async function handler(req: Request) {
  console.log("Incoming request:", req.url);
  console.log("Checking if path matches:", IMPORT_MAP_PATH);
  
  if (req.method === "GET" && req.url === IMPORT_MAP_PATH) {
    console.log("Serving import map from:", DEFAULT_IMPORT_MAP_PATH);
    try {
      const importMap = Deno.readTextFileSync(DEFAULT_IMPORT_MAP_PATH);
      const response = new Response(importMap, {
        headers: {
          "content-type": "application/json"
        }
      });
      console.log("Successfully returned import map");
      return response;
    } catch (error) {
      console.error("Error reading import map:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  
  console.log("Returning 404 for:", req.url);
  return new Response("Not Found", { status: 404 });
}

serve(handler, { port: 8000 });
