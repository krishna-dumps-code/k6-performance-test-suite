import http from "k6/http"
import { check, group } from "k6"

import { BASE_URL } from "../config"
import { PatchResponse } from "../types"
import { patch_success_rate, patch_duration, check_failure_rate } from "../metrics"

export function patchObject(id: string, name: string) {

  group("PATCH /objects/{id}", () => {

    const payload = {
      name: `${name} (Updated)`
    }

    const res = http.patch(
      `${BASE_URL}/objects/${id}`,
      JSON.stringify(payload),
      { headers: { "Content-Type": "application/json" }, tags: { endpoint: "patch_object" } }
    )

    patch_duration.add(res.timings.duration)

    const ok = check(res, {

      "status 200": r => r.status === 200,

      "response body not empty": r => r.body.length > 0,

      "updatedAt exists": r => (r.json() as PatchResponse).updatedAt !== undefined
    })

    if (!ok) check_failure_rate.add(1)

    patch_success_rate.add(ok)
  })
}
