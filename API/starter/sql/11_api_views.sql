-- 11_api_views.sql  (Course 5, Module 5) -- run as root, after the Course 4 rebuild.
--
-- NOTE FROM THE PLAYGROUND AUTHOR: the Module 5 slides use these views but defer the exact SQL to the course's
-- MD files. This is a faithful reconstruction of the contract (column names are the JSON keys). If your Course 4
-- table or column names differ, change the FROM/JOIN parts, never the AS aliases: the aliases ARE the contract.
USE future_portfolio_db;

CREATE OR REPLACE VIEW v_api_profile AS
SELECT full_name, headline, location, summary
FROM people WHERE person_id = 1;                       -- 4 keys, no email

CREATE OR REPLACE VIEW v_api_summary AS
SELECT
  (SELECT COUNT(DISTINCT e.company_id) FROM employment e JOIN roles r ON r.employment_id = e.employment_id) AS companies,
  (SELECT COUNT(*) FROM roles)    AS roles,
  (SELECT COUNT(*) FROM projects) AS projects,
  (SELECT COUNT(*) FROM skills)   AS skills,
  (SELECT COUNT(*) FROM awards)   AS awards,
  (SELECT CAST(YEAR(COALESCE(MAX(end_date), CURDATE())) - YEAR(MIN(start_date)) AS DECIMAL(6,1)) FROM employment) AS career_years;

CREATE OR REPLACE VIEW v_api_experience AS
SELECT r.role_id AS id, c.company_name AS company, r.role_title AS role,
       r.role_start AS start_date, r.role_end AS end_date, r.team_size AS team_size
FROM roles r
JOIN employment e ON e.employment_id = r.employment_id
JOIN companies  c ON c.company_id    = e.company_id;

CREATE OR REPLACE VIEW v_api_projects AS
SELECT p.project_id AS project_id, p.project_name AS project, r.role_title AS role, c.company_name AS company,
       (SELECT JSON_ARRAYAGG(s.skill_name)
          FROM project_skills ps JOIN skills s ON s.skill_id = ps.skill_id
         WHERE ps.project_id = p.project_id) AS skills       -- JSON text: Python must json.loads() it
FROM projects p
JOIN role_projects rp ON rp.project_id = p.project_id
JOIN roles r          ON r.role_id     = rp.role_id
JOIN employment e     ON e.employment_id = r.employment_id
JOIN companies c      ON c.company_id  = e.company_id;

CREATE OR REPLACE VIEW v_api_skills AS
SELECT s.skill_id AS id, s.skill_name AS skill, s.category AS category,
       (SELECT COUNT(DISTINCT ps.project_id) FROM project_skills ps WHERE ps.skill_id = s.skill_id) AS project_count
FROM skills s;

CREATE OR REPLACE VIEW v_api_education AS
SELECT education_id AS id, qualification, institution, type, start_year, end_year FROM education;

CREATE OR REPLACE VIEW v_api_awards AS
SELECT award_id AS id, award_name AS award, awarding_body AS awarded_by,
       award_year AS year, award_category AS category
FROM awards;

-- The read-only API user sees ONLY these views (Course 4 Module 9). Replace the passphrase first.
-- CREATE USER IF NOT EXISTS 'portfolio_web'@'localhost' IDENTIFIED BY 'CHANGE-ME-your-own-passphrase';
GRANT SELECT ON future_portfolio_db.v_api_profile    TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_summary    TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_experience TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_projects   TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_skills     TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_education  TO 'portfolio_web'@'localhost';
GRANT SELECT ON future_portfolio_db.v_api_awards     TO 'portfolio_web'@'localhost';
