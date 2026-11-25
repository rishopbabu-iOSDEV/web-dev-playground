# Security review (Module 8 lab)

| Threat | Our defence | Tested by |
|---|---|---|
| SQL injection | Values as `%s`; structure from fixed lists | Module 5 attack |
| Private data | `v_api_*` views; no email; messages private | A12; search responses for `@` |
| Too much database power | `portfolio_web` (read) / `portfolio_writer` (write) grants | `SHOW GRANTS` |
| Strangers on owner endpoints | `require_owner` on five endpoints | S01–S04, A15 |
| Bad input | Type hints, `Query`, Pydantic, constraints | A03, A07, W02–W04 |
| Errors revealing internals | One error format; one-sentence 500 | Stop MySQL, send A01 |
| Other sites' pages | CORS: two exact origins | S10, S11 |
| Keys in the browser or in Git | Proxy; `.env` ignored; history searched | S12; the audit command |

## Known gaps (accepted for now)

1. No rate limit on the contact form.
2. One shared owner key (no accounts).
3. Plain HTTP on localhost.
4. *Your own gap here:*
