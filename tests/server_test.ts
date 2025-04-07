import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { handler } from "../server.ts";

Deno.test("Server returns import map", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  assertEquals(response.status, 200);
});

Deno.test("Server returns correct import map content", async () => {
  const req = new Request("http://localhost:8000/my-app/import-map.json");
  const response = await handler(req);
  const expected = await Deno.readTextFile("default-import-map.json");
  const actual = await response.text();
  assertEquals(actual, JSON.stringify(JSON.parse(expected), null, 2));
});

Deno.test("Server applies feature flag overrides correctly", async () => {
  // Arrange
  // Create a request with the feature-alpha feature flag
  const req = new Request("http://localhost:8000/my-app/import-map.json", {
    headers: {
      "X-Feature-Flag": "feature-alpha"
    }
  });
  
  // Define the expected merged import map directly
  // This represents what we expect after merging the default map with feature-alpha overrides
  const expected = {
    imports: {
      "@me/host": "/stuff/fixed",
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/3.0.0-beta/test789.js", // This is the overridden value
      "@me/module-c": "https://my-host/module-c/2.8.3/tuv123.js"
    }
  };
  
  // Act
  // Call the handler with our request containing the feature flag
  const response = await handler(req);
  const responseText = await response.text();
  const actual = JSON.parse(responseText);
  
  // Assert
  // Verify the response contains the correctly merged import map
  assertEquals(actual, expected);
});

