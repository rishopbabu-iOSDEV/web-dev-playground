# Acceptance record (Module 6)

Send each request from `module-04.http` while the server log is visible. One row per request.

| # | Request | Expected | Actual | Pass? | If not, why (and which module fixes it) |
|---|---------|----------|--------|-------|------------------------------------------|
| A01 | GET /api/awards | 200, 19 items, X-Total-Count 19 | | | |
| A02 | GET /api/awards?category=Industry | 200, 7 items | | | |
| A03 | GET /api/awards?category=Personal | 422 | | | body is {"detail": …}, not our format → Module 8 |
| A04 | GET /api/education/1 | 200 | | | |
| A05 | GET /api/education/99 | 404 | | | |
| A06 | GET /api/awards?year_from=2020 | 200, 7 items | | | |
| A07 | GET /api/awards?limit=500 | 422 | | | |
| A08 | GET /api/awards?page=2&limit=5 | 200, 5 items, total 19 | | | |
| A09 | GET /api/experience?company=CloudHarbor Software | 4 items | | | |
| A10 | GET /api/projects?skill=Platform migration | 8 rows | | | |
| A11 | GET /api/skills?evidenced=false | 2 items | | | |
| A12 | GET /api/resume | 17 roles, no @ anywhere | | | |
| A13 | GET /api/summary | 7 / 17 / 16 / 17 / 19 / 40.0 | | | |
| A14 | DELETE /api/summary | 405 | | | |
| A15 | GET /api/messages | 401 | | | route does not exist yet → Modules 7 and 8 |

## Spec gaps (what /docs does not show yet)

- /docs lists only 200 and 422. The spec also promises 404, 405 and the error format.
- Responses are plain dictionaries. Pydantic models (Module 7) will describe them.
- (Add your own.)

> The A-numbers and expected values above come from the playground's own test list. If your `module-04.http` differs, your file wins.
