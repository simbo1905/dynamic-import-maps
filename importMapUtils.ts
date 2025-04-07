// Types
export interface ImportMap {
  imports: Record<string, string>;
}

export interface FeatureMap {
  [featureFlag: string]: Record<string, string>;
}

/**
 * Merges the default import map with feature-specific overrides
 * @param defaultMap The default import map
 * @param featureMap The feature map containing overrides
 * @param featureFlag The active feature flag
 * @returns A merged import map
 */
export function mergeImportMaps(
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
