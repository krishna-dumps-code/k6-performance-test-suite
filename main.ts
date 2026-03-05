import { seedObjects } from './scenarios/seedObjects'
import { patchObjects } from './scenarios/patchObjects'
import { SANITY_MODE } from './config'

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    patch_success_rate: ['rate>0.95']
  },

  scenarios: {

    seed_objects: {
      executor: 'shared-iterations',
      exec: 'seedObjects',
      vus: 1,
      iterations: SANITY_MODE ? 2 : 10,
      maxDuration: '1m',
      tags: { phase: 'seed' }
    },

    patch_objects: {
      executor: 'ramping-arrival-rate',
      exec: 'patchObjects',

      startRate: SANITY_MODE ? 1 : 5,
      timeUnit: '1s',

      preAllocatedVUs: SANITY_MODE ? 1 : 10,
      maxVUs: SANITY_MODE ? 2 : 50,

      stages: SANITY_MODE
        ? [{ target: 1, duration: '10s' }]
        : [
            { target: 10, duration: '30s' },
            { target: 20, duration: '1m' },
            { target: 0, duration: '30s' }
          ],

      tags: { phase: 'patch' }
    }
  }
}

export { seedObjects, patchObjects }

export function handleSummary(data: any) {
  const summary = {
    total_requests: data.metrics.http_reqs.values.count,
    error_rate: data.metrics.http_req_failed.values.rate,
    p50: data.metrics.http_req_duration.values['p(50)'],
    p90: data.metrics.http_req_duration.values['p(90)'],
    p95: data.metrics.http_req_duration.values['p(95)'],
    p99: data.metrics.http_req_duration.values['p(99)']
  }

  return {
    'reports/summary.json': JSON.stringify(summary, null, 2)
  }
}
