import { loadObjects } from "./utils/csvReader"
import { randomItem } from "./utils/random"

import { seedObject, seededIds } from "./scenarios/seedObjects"
import { patchObject } from "./scenarios/patchObjects"

import { MODE, SANITY, SEED_COUNT } from "./config"

const objects = loadObjects("./data/objects.csv")

let patchIds: string[] = []

if (MODE === "patch") {
  patchIds = JSON.parse(open("./data/seeded_ids.json"))
}

export const options = {

  scenarios: {

    patch_flow: SANITY
      ? { executor: "shared-iterations", vus: 1, iterations: 3 }
      : { executor: "constant-vus", vus: 5, duration: "1m" }
  },

  thresholds: {

    http_req_duration: ["p(95)<800"],

    http_req_failed: ["rate<0.02"],

    patch_success_rate: ["rate>0.95"]
  }
}

export function setup() {

  if (MODE !== "full") return null

  const ids: string[] = []

  for (let i = 0; i < SEED_COUNT; i++) {

    const data = objects[i % objects.length]

    const id = seedObject(data)

    ids.push(id)
  }

  return ids
}

export default function (ids) {

  if (MODE === "seed") {

    const data = randomItem(objects)

    seedObject(data)

  } else if (MODE === "patch") {

    const id = randomItem(patchIds)

    patchObject(id, "PatchedObject")

  } else {

    const id = randomItem(ids)

    patchObject(id, "UpdatedObject")
  }
}

export function handleSummary(data) {

  const summary = {

    total_requests: data.metrics.http_reqs.values.count,

    error_rate: data.metrics.http_req_failed.values.rate,

    p50: data.metrics.http_req_duration.values["p(50)"],
    p90: data.metrics.http_req_duration.values["p(90)"],
    p95: data.metrics.http_req_duration.values["p(95)"],
    p99: data.metrics.http_req_duration.values["p(99)"]
  }

  return {
    "reports/summary.json": JSON.stringify(summary, null, 2),
    "data/seeded_ids.json": JSON.stringify(seededIds, null, 2)
  }
}
