---
description: Create a new GitHub release with auto-detected semver bump
---

You are a release manager. Your job is to create a new GitHub release for this project.
An optional argument can be passed to force the semver bump type (e.g. `/release major`).

Follow these steps **exactly in order**. Do NOT skip any step.

## Step 1: Validate branch

Run `git branch --show-current` to check we are on `main`.
If NOT on `main`, stop immediately and tell the user:
> "You must be on the `main` branch to create a release. Current branch: <branch>"

## Step 2: Ensure main is up to date

Run `git fetch origin main && git status` to check if the local `main` is behind `origin/main`.
If behind, stop and tell the user:
> "Your local main branch is behind origin/main. Please run `git pull` first."

## Step 3: Check for open PRs

Run `gh pr list --base main --state open --json number,title,author --limit 20`.
If there are open PRs, list them as a warning:
> **Warning: There are open PRs targeting main:**
> - #<number>: <title> (by <author>)
>
> These are not included in this release.

If there are no open PRs, say "No open PRs targeting main."

## Step 4: Check CI status

Run `gh run list --branch main --limit 1 --json status,conclusion,name`.
If the latest run has `conclusion` other than `"success"`, stop and tell the user:
> "The latest CI run on main failed or is still running. Please fix CI before releasing."
> Show the run name, status and conclusion.

If CI is green, say "CI is passing on main."

## Step 5: Determine last release and new commits

Run `gh release list --limit 1 --json tagName -q '.[0].tagName'` to get the latest release tag.
Then run `git log <last-tag>..HEAD --oneline --no-decorate` to list commits since that tag.

If there are NO new commits since the last tag, stop and tell the user:
> "No new commits since <last-tag>. Nothing to release."

## Step 6: Suggest semver bump

Analyze the commit messages from Step 5 using Conventional Commits:
- If any commit contains `BREAKING CHANGE` in the body/footer, or has a `!` after the type (e.g. `feat!:`), suggest **major**
- If any commit starts with `feat` or `feat(`, suggest **minor**
- Otherwise (only `fix`, `chore`, `docs`, `refactor`, `test`, etc.), suggest **patch**

Parse the last release tag to extract the current version numbers.
Calculate the suggested next version.

If the user passed an argument ($ARGUMENTS), use that as the bump type instead of the auto-detected one.
Valid arguments: `major`, `minor`, `patch`. If the argument is not valid, stop and show an error.

Display a summary:
> **Release summary:**
> - Current version: <current>
> - New version: **<new>**
> - Bump type: <type> (<reason>)
> - Commits included: <count>
>
> <list of commits>

## Step 7: Ask for confirmation

Ask the user to confirm the release. Use the question tool with these options:
- "Yes, create release v<new>"
- "No, abort"

If the user says no, stop and say "Release aborted."

## Step 8: Create the release

Run: `gh release create v<new> --target main --title "v<new>" --generate-notes`

Then confirm success:
> Release **v<new>** created successfully!
> This will trigger the publish workflow to npm.
> View: <release URL>
