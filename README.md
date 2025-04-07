# Dynamic Import Map Server

A lightweight server for dynamically generating import maps with feature flag support.

## Overview

This server delivers customized `import-map.json` files to browsers based on default configurations and optional feature flags. It enables beta testing of micro-frontend modules by allowing specific users to receive different module versions.

## Features

* Serves default import maps when no feature flag is present
* Supports feature-based version overrides via a HTTP header
* Configuration through simple JSON files

## Configuration

The server uses two main configuration files:

1. `default-import-map.json` - The base import map served to all users
2. `feature-map.json` - Defines version overrides for each feature

An example default import map is:

```json
{
  "imports": {
    "@me/host": "/stuff/fixed",
    "@me/module-a": "https://my-host/module-a/1.2.3/asdf998.js",
    "@me/module-b": "https://my-host/module-b/4.6.1/jiu639.js",
    "@me/module-c": "https://my-host/module-c/2.8.3/tuv123.js",
  }
}
```

An example feature map is:

```json
{
  "feature-omega": {
    "@me/module-a": "1.3.0/beta123.js",
    "@me/module-c": "2.9.0/gamma456.js"
  },
  "feature-alpha": {
    "@me/module-b": "3.0.0-beta/test789.js"
  }
}
```

## Usage

Start the server with 

```shell
deno run --allow-net --allow-read server.ts
```

Access the import map no overrides with:

```shell
curl -X GET http://localhost:8000/my-app/import-map.json
```

Access the imort map with an override with:

```shell
curl -X GET -H "X-Feature-Flag: feature-omega" http://localhost:8000/my-app/import-map.json
```

End
