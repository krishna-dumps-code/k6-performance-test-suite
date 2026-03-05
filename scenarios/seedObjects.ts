import http from "k6/http"
import { check, group } from "k6"

import { BASE_URL } from "../config"
import { ObjectPayload, CreateObjectResponse } from "../types"
import { check_failure_rate } from "../metrics"

export const seededIds: string[] = []

export function seedObject(data) {

  let id = ""

  group("POST /objects", () => {

    const payload: ObjectPayload = {

      name: data.name,

      data: {
        year: data.year,
        price: data.price
      }
    }

    const res = http.post(
      `${BASE_URL}/objects`,
      JSON.stringify(payload),
      { headers: { "Content-Type": "application/json" }, tags: { endpoint: "create_object" } }
    )

    const ok = check(res, {

      "status 200": r => r.status === 200,

      "response body not empty": r => r.body.length > 0,

      "id exists": r => (r.json() as CreateObjectResponse).id !== undefined
    })

    if (!ok) check_failure_rate.add(1)

    id = (res.json() as CreateObjectResponse).id

    seededIds.push(id)
  })

  return id
}
