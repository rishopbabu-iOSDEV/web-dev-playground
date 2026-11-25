-- 12_contact_messages.sql  (Course 5, Module 7) -- run as root, after 11_api_views.sql.
USE future_portfolio_db;

CREATE TABLE IF NOT EXISTS contact_messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(254)  NOT NULL,                 -- 254 is the longest valid email address
  message    VARCHAR(2000) NOT NULL,
  sent_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,   -- the server decides
  is_read    BOOLEAN  NOT NULL DEFAULT FALSE                -- the server decides
);

-- Owner-only view. NEVER granted to portfolio_web: visitors' emails stay out of /api/resume.
CREATE OR REPLACE VIEW v_owner_messages AS
SELECT message_id AS id, name, email, message, sent_at, is_read
FROM contact_messages;

-- A user that can write, and nothing more (least privilege). Replace the passphrase before running.
CREATE USER IF NOT EXISTS 'portfolio_writer'@'localhost' IDENTIFIED BY 'CHANGE-ME-another-passphrase';

GRANT SELECT, INSERT, UPDATE, DELETE ON future_portfolio_db.contact_messages TO 'portfolio_writer'@'localhost';
GRANT SELECT                         ON future_portfolio_db.v_owner_messages TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT, UPDATE         ON future_portfolio_db.projects         TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT                 ON future_portfolio_db.companies        TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT                 ON future_portfolio_db.employment       TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT                 ON future_portfolio_db.roles            TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT                 ON future_portfolio_db.role_projects    TO 'portfolio_writer'@'localhost';
GRANT SELECT, INSERT                 ON future_portfolio_db.project_skills   TO 'portfolio_writer'@'localhost';
GRANT SELECT                         ON future_portfolio_db.skills           TO 'portfolio_writer'@'localhost';
GRANT SELECT, UPDATE                 ON future_portfolio_db.people           TO 'portfolio_writer'@'localhost';
-- DELETE only on messages: no endpoint deletes a company or a role, so no privilege does. A bug would hit 1142.

SHOW GRANTS FOR 'portfolio_writer'@'localhost';
