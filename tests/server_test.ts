import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handler } from "../server.ts";

// Start test server and wait for it to be ready
const server = serve(handler, { port: 8000 });

// Wait for the server to start
await new Promise((resolve) => {
  server.addEventListener('listen', () => {
    console.log('Server is listening on http://localhost:8000');
    resolve();
  });
});

Deno.test("Server returns default import map", async () => {
  const response = await fetch("http://localhost:8000/my-app/import-map.json");
  assertEquals(response.status, 200);
});

Deno.test("Server returns correct default import map content", async () => {
  const response = await fetch("http://localhost:8000/my-app/import-map.json");
  const expected = Deno.readTextFileSync("default-import-map.json");
  const actual = await response.text();
  assertEquals(actual, expected);
});

Deno.test("Server returns 404 for unknown paths", async () => {
  const response = await fetch("http://localhost:8000/unknown/path");
  assertEquals(response.status, 404);
});

