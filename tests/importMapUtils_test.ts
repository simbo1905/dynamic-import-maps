import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { ImportMap, FeatureMap, mergeImportMaps } from "../importMapUtils.ts";

Deno.test("mergeImportMaps - returns default map when feature map is empty", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
    },
  };
  const featureMap: FeatureMap = {};
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should return the default map unchanged when feature map is empty
  assertEquals(result, defaultMap);
});

Deno.test("mergeImportMaps - returns default map when feature flag doesn't exist", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-alpha": {
      "@me/module-a": "2.0.0/beta123.js",
    },
  };
  const featureFlag = "feature-omega"; // This feature doesn't exist in the map

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should return the default map unchanged when feature flag doesn't exist
  assertEquals(result, defaultMap);
});

Deno.test("mergeImportMaps - ignores modules in feature map not present in default map", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0/beta123.js",
      "@me/module-c": "3.0.0/gamma456.js", // This module doesn't exist in default map
    },
  };
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should only override modules that exist in the default map
  assertEquals(result, {
    imports: {
      "@me/module-a": "https://my-host/module-a/2.0.0/beta123.js",
    },
  });
});

Deno.test("mergeImportMaps - applies single module override successfully", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0/beta123.js",
    },
  };
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should override only module-a with the new version path
  assertEquals(result, {
    imports: {
      "@me/module-a": "https://my-host/module-a/2.0.0/beta123.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
    },
  });
});

Deno.test("mergeImportMaps - applies multiple module overrides from same feature", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
      "@me/module-c": "https://my-host/module-c/2.8.3/tuv123.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0/beta123.js",
      "@me/module-c": "3.0.0/gamma456.js",
    },
  };
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should override both module-a and module-c with their respective new version paths
  assertEquals(result, {
    imports: {
      "@me/module-a": "https://my-host/module-a/2.0.0/beta123.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
      "@me/module-c": "https://my-host/module-c/3.0.0/gamma456.js",
    },
  });
});

Deno.test("mergeImportMaps - handles complex URL path construction correctly", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/path/to/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://cdn.example.com/libs/module-b/4.6.1/jiu639.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0-beta/test123.js",
      "@me/module-b": "5.0.0-alpha/preview789.js",
    },
  };
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should correctly extract base URLs and append new version paths
  assertEquals(result, {
    imports: {
      "@me/module-a": "https://my-host/path/to/module-a/2.0.0-beta/test123.js",
      "@me/module-b": "https://cdn.example.com/libs/module-b/5.0.0-alpha/preview789.js",
    },
  });
});

Deno.test("mergeImportMaps - returns default map when feature flag is null or empty", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0/beta123.js",
    },
  };
  
  // Act - with null feature flag
  const resultNull = mergeImportMaps(defaultMap, featureMap, null as unknown as string);
  
  // Act - with empty feature flag
  const resultEmpty = mergeImportMaps(defaultMap, featureMap, "");

  // Assert
  // Should return the default map unchanged when feature flag is null or empty
  assertEquals(resultNull, defaultMap);
  assertEquals(resultEmpty, defaultMap);
});

Deno.test("mergeImportMaps - preserves non-overridden modules", () => {
  // Arrange
  const defaultMap: ImportMap = {
    imports: {
      "@me/host": "/stuff/fixed",
      "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
      "@me/module-c": "https://my-host/module-c/2.8.3/tuv123.js",
    },
  };
  const featureMap: FeatureMap = {
    "feature-omega": {
      "@me/module-a": "2.0.0/beta123.js",
    },
  };
  const featureFlag = "feature-omega";

  // Act
  const result = mergeImportMaps(defaultMap, featureMap, featureFlag);

  // Assert
  // Should only override module-a and preserve all other modules
  assertEquals(result, {
    imports: {
      "@me/host": "/stuff/fixed",
      "@me/module-a": "https://my-host/module-a/2.0.0/beta123.js",
      "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
      "@me/module-c": "https://my-host/module-c/2.8.3/tuv123.js",
    },
  });
});
