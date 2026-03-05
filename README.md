# k6-performance-test-suite

This project implements a k6 + TypeScript performance test suite for the following APIs:

POST /objects → create objects

PATCH /objects/{id} → update objects

# API Base:
https://api.restful-api.dev

The test is divided into two phases which can run independently or together.

#Test Phases
Phase 1 — Seed Objects

Creates objects using CSV input.

Executor:

shared-iterations

# Key points:

Runs with 1 VU only

Creates 10 objects

Extracts IDs from responses

Saves IDs to:

data/seeded_objects.json
Phase 2 — Patch Objects

Updates previously created objects.

Executor:

ramping-arrival-rate

# Flow:

Load seeded IDs

Randomly select an ID

Send PATCH request

Validate response

Data Design
Input CSV
data/objects.csv

# Example:

name,year
MacBook Pro,2019
ThinkPad X1,2021

Used to construct POST payload.

Seeded IDs Storage
data/seeded_objects.json

Allows the PATCH test to run independently later.

Checks Implemented

Each request validates:

Correct HTTP status

Non-empty response body

Expected field validation

Failures increment custom metric:

check_failure_rate
Custom Metrics

check_failure_rate

patch_success_rate

patch_duration

Thresholds

# Example thresholds:

p95 http_req_duration < 800ms
error rate < 1%
patch_success_rate > 95%

# Summary Report

A JSON report is generated after execution:

reports/summary.json

Contains:

total requests

error rate

latency percentiles (p50, p90, p95, p99)

threshold results

Environment Variables

Configurable using __ENV.

# Variable	Purpose
BASE_URL	API base URL
CSV_PATH	CSV input file
SEEDED_FILE	Seeded IDs file
AUTH_TOKEN	Optional token
SANITY	quick test mode

# Run Commands
Run Full Test
k6 run -e AUTH_TOKEN="<token>" -e CSV_PATH=./data/objects.csv main.ts

Run Sanity Test
k6 run -e SANITY=true -e AUTH_TOKEN="<token>" -e CSV_PATH=./data/objects.csv main.ts

Run Seed Phase Only
k6 run -e SCENARIO=seed -e AUTH_TOKEN="<token>" -e CSV_PATH=./data/objects.csv main.ts

Run Patch Phase Only
k6 run -e SCENARIO=patch -e AUTH_TOKEN="<token>" -e CSV_PATH=./data/objects.csv main.ts


# Personal Approach & Implementation Notes

Seeded IDs are persisted to JSON, allowing the PATCH test to run independently without reseeding.

CSV schema was kept minimal to focus on meaningful payload construction rather than unnecessary data complexity.

The project separates scenarios, utilities, configuration, and metrics to keep the test modular and easier to maintain.

A sanity execution mode was added to quickly validate script functionality before running larger tests.

# Tools

k6
TypeScript
