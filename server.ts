import { serve } from "https://deno.land/std@0.186.0/http/server.ts";

const DEFAULT_IMPORT_MAP_PATH = "default-import-map.json";
const IMPORT_MAP_PATH = "/my-app/import-map.json";

// Basic server to serve the default import map
serve({
  port: 8000,
  handler: (req) => {
    if (req.method === "GET" && req.url === IMPORT_MAP_PATH) {
      try {
        const importMap = Deno.readTextFileSync(DEFAULT_IMPORT_MAP_PATH);
        return new Response(importMap, {
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
          },
        });
      } catch (error) {
        return new Response(`Error reading import map: ${error.message}`, {
          status: 500,
        });
      }
    }
    return new Response("Not Found", { status: 404 });
  },
});
