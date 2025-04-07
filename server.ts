import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Constants
const FEATURE_FLAG_HEADER = "X-Feature-Flag";
const DEFAULT_IMPORT_MAP_PATH = "./default-import-map.json";
const FEATURE_MAP_PATH = "./feature-map.json";
const IMPORT_MAP_PATH = "/my-app/import-map.json";

// Types
interface ImportMap {
  imports: Record<string, string>;
}

interface FeatureMap {
  [featureFlag: string]: Record<string, string>;
}

/**
 * Reads and parses a JSON file
 * @param path Path to the JSON file
 * @returns Parsed JSON content
 */
async function readJsonFile<T>(path: string): Promise<T> {
  try {
    const text = await Deno.readTextFile(path);
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error reading file ${path}:`, error);
    throw error;
  }
}

/**
 * Merges the default import map with feature-specific overrides
 * @param defaultMap The default import map
 * @param featureMap The feature map containing overrides
 * @param featureFlag The active feature flag
 * @returns A merged import map
 */
function mergeImportMaps(
  defaultMap: ImportMap,
  featureMap: FeatureMap,
  featureFlag: string
): ImportMap {
  // If no feature flag or the feature doesn't exist in the map, return default
  if (!featureFlag || !featureMap[featureFlag]) {
    return defaultMap;
  }

  const featureOverrides = featureMap[featureFlag];
  const result: ImportMap = {
    imports: { ...defaultMap.imports },
  };

  // Apply overrides for the specified feature
  for (const [module, versionPath] of Object.entries(featureOverrides)) {
    // Check if the module exists in the default map
    if (result.imports[module]) {
      // Extract the base URL from the default import
      const baseUrl = result.imports[module].split("/").slice(0, -2).join("/");
      // Replace with the new version path
      result.imports[module] = `${baseUrl}/${versionPath}`;
    }
  }

  return result;
}

/**
 * HTTP request handler for the import map server
 * @param req The incoming HTTP request
 * @returns HTTP response with appropriate import map
 */
export async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // Only handle requests for import-map.json
  if (url.pathname === IMPORT_MAP_PATH) {
    try {
      // Read the default import map
      const defaultImportMap = await readJsonFile<ImportMap>(DEFAULT_IMPORT_MAP_PATH);
      
      // Check for feature flag header
      const featureFlag = req.headers.get(FEATURE_FLAG_HEADER);
      
      if (featureFlag) {
        // Read the feature map and merge with default
        const featureMap = await readJsonFile<FeatureMap>(FEATURE_MAP_PATH);
        const mergedMap = mergeImportMaps(defaultImportMap, featureMap, featureFlag);
        
        return new Response(JSON.stringify(mergedMap, null, 2), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      
      // Return the default import map if no feature flag
      return new Response(JSON.stringify(defaultImportMap, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error processing import map request:", error);
      return new Response("Error processing import map", { status: 500 });
    }
  }
  
  // Return 404 for any other paths
  return new Response("Not Found", { status: 404 });
}

// Start the server if this file is run directly
if (import.meta.main) {
  console.log("Starting import map server on http://localhost:8000");
  serve(handler, { port: 8000 });
}
