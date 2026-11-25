# Module 9 test matrix

Do each row, look at the page, the Network tab and the API terminal, then record **Pass** or **Fail** and a screenshot name.
Tick **Disable cache** in DevTools first. Test from `127.0.0.1` (not `localhost`: a different origin).

| # | Situation | Expected | Result | Screenshot / note |
|---|---|---|---|---|
| T01 | Live Server, API running | Badge "Live from the Future Portfolio API"; awards page 1 of 4 | | |
| T02 | Live Server, **API stopped** | Badge "Published snapshot, updated …"; page still complete | | |
| T03 | `?source=snapshot`, API running | Snapshot badge; no request to port 8000 | | |
| T04 | Public host (GitHub Pages) | Snapshot; nothing tries 127.0.0.1 | | |
| T05 | Awards: Next to page 2, then 4 | Pager correct; Next disabled on last page; same in snapshot mode | | |
| T06 | `?category=Company` | Only company awards; total changes; same from both sources | | |
| T07 | `?category=Personal` (live) | A sentence about categories, not a crash | | |
| T08 | Contact: good message (live) | "Thank you … reference #n"; form cleared; row visible with the owner key | | |
| T09 | Contact: `ravi-at-example` | Email field highlighted and focused; typed message kept | | |
| T10 | Contact: double-click Send | One message only | | |
| T11 | Contact with the API stopped | "We can't reach the service right now."; input kept; button back | | |
| T12 | A project name containing `<img onerror=…>` | Shows as text; nothing runs | | |
| T13 | GitHub card: proxy, then stop API, then offline | Proxy first; GitHub direct second; page cache or status line last | | |
| T14 | Contact form on the public site | Form disabled with an explanation; no failed request | | |

Note: this is a working version written for the playground. Replace any row that differs from your course's own `test-matrix.md`.
