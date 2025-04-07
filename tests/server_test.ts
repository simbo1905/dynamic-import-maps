import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { handler } from "../server.ts";
import { readTextFileSync } from "https://deno.land/std/fs/mod.ts";

Deno.test("Server returns import map", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  assertEquals(response.status, 200);
});

Deno.test("Server returns correct import map content", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  const expected = readTextFileSync("default-import-map.json");
  const actual = await response.text();
  assertEquals(actual, expected);
});

