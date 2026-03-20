# GitHub Push and PR TODO

## Pending Steps:
1. Install GitHub CLI: `winget install --id GitHub.cli` (or download MSI from https://cli.github.com/)
2. Login: `gh auth login`
3. Stage changes: `git add .`
4. Commit: `git commit -m "Update docs, TODOs, env files, add backend README"`
5. New branch: `git checkout -b blackboxai/updates`
6. Push branch: `git push -u origin blackboxai/updates`
7. Create PR: `gh pr create --title "Updated documentation and config files" --body "Changes: docs, TODOs, .env, backend README"`

**Next: Run step 1 and confirm install, then proceed.**

