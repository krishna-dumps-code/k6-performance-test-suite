import { Rate, Trend } from "k6/metrics"

export const check_failure_rate = new Rate("check_failure_rate")

export const patch_success_rate = new Rate("patch_success_rate")

export const patch_duration = new Trend("patch_duration")
