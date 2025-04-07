import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import { readTextFileSync } from "https://deno.land/std@0.186.0/fs/mod.ts";

// Import the server handler
import { handler } from "../server.ts";

Deno.test("Server returns default import map", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  
  assertEquals(response.status, 200);
});

Deno.test("Server returns correct default import map content", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  
  const expected = readTextFileSync("default-import-map.json");
  const actual = await response.text();
  
  assertEquals(actual, expected);
});

Deno.test("Server returns 404 for unknown paths", async () => {
  const req = new Request("http://localhost:8000/unknown/path");
  const response = await handler(req);
  
  assertEquals(response.status, 404);
});
