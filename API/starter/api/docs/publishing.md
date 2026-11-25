# Publishing the snapshot

The public site is only as fresh as the last snapshot you committed.

1. Start MySQL. In the project folder: `python scripts/db_to_json.py` (rewrites `data/resume.json` and its `generated_at` date).
2. Open `resume.html?source=snapshot` with Live Server. The badge must show today's date.
3. `git status`: only `data/resume.json` (and code you meant to change) should be modified. **No `.env`.**
4. `git add data/resume.json` → `git commit -m "Refresh resume snapshot"` → `git push`.
5. GitHub Pages serves it a minute later. Open the public URL; the badge must show the new date and the contact form must be disabled.
6. Re-run the history search from Module 8: `git log -p --all | grep -n -i -E "(password|_key|token)[ ]*=[ ]*[^ ]"`.
