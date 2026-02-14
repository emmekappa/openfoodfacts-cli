import OpenFoodFacts, { SearchApi } from "@openfoodfacts/openfoodfacts-nodejs";

let searchApi: SearchApi | null = null;
let client: OpenFoodFacts | null = null;

export function getSearchApi(): SearchApi {
  if (!searchApi) {
    searchApi = new SearchApi(globalThis.fetch);
  }
  return searchApi;
}

export function getClient(): OpenFoodFacts {
  if (!client) {
    client = new OpenFoodFacts(globalThis.fetch);
  }
  return client;
}
