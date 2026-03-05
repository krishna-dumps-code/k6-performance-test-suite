export const BASE_URL = "https://api.restful-api.dev"

export const SANITY = __ENV.SANITY === "true"

// Modes
// seed → create objects
// patch → update existing objects
// full → seed + patch
export const MODE = __ENV.MODE || "full"

export const SEED_COUNT = 10
