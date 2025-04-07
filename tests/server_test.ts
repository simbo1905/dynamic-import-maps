import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { handler } from "../server.ts";

Deno.test("Server returns import map", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  assertEquals(response.status, 200);
});

