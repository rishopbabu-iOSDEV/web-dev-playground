-- 13_withdraw_appointment.sql  (Course 5, Module 7 lab) -- run as ROOT, never as the API's user:
-- portfolio_writer has no DELETE on these tables, and the spec has no endpoint for this.
-- This is a COMPENSATING transaction: ROLLBACK cannot undo a COMMIT (Course 4 Module 8), so we run the opposite.
USE future_portfolio_db;

-- Put YOUR four ids from the W14 response here. (The IDs are NOT necessarily 8, 18, 17: AUTO_INCREMENT never reuses a number.)
SET @company = 0, @employment = 0, @role = 0, @project = 0;       -- <- placeholders: replace, run, then put them back to 0

START TRANSACTION;
DELETE FROM projects   WHERE project_id    = @project;
DELETE FROM roles      WHERE role_id       = @role;        -- ON DELETE CASCADE removes the role_projects link rows
DELETE FROM employment WHERE employment_id = @employment;
DELETE FROM companies  WHERE company_id    = @company;
UPDATE people SET headline = 'Former Chief Technology Officer | Candidate for non-executive board roles'
WHERE person_id = 1;
SELECT * FROM v_api_summary;     -- expect: 7 | 17 | 16 | 17 | 19 | 40.0
COMMIT;
-- If the SELECT is wrong, type ROLLBACK; instead of COMMIT; and check your ids.
