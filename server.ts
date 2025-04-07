import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const DEFAULT_IMPORT_MAP_PATH = "default-import-map.json";
const IMPORT_MAP_PATH = "/my-app/import-map.json";

// Basic server to serve the default import map
export async function handler(req: Request) {
  console.log("Handling request:", req.url);
  try {
    if (req.method === "GET" && req.url === IMPORT_MAP_PATH) {
      const importMap = Deno.readTextFileSync(DEFAULT_IMPORT_MAP_PATH);
      return new Response(importMap, {
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
        },
      });
    }
    return new Response("Not Found", { status: 404 });
  } catch (error) {
    return new Response(`Error reading import map: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    });
  }
}

// Updated serve API - handler function comes first, then options
serve(handler, { 
  port: 8000,
  hostname: "localhost"
});
