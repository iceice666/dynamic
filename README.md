# Astro Starter Kit: Basics

```sh
pnpm create astro@latest --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `pnpm install`      | Installs dependencies                            |
| `pnpm dev`          | Starts local dev server at `localhost:4321`      |
| `pnpm build`        | Build your production site to `./dist/`          |
| `pnpm preview`      | Preview your build locally, before deploying     |
| `pnpm astro ...`    | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro --help` | Get help using the Astro CLI                     |

## 🚀 Deployment (Cloudflare Workers)

This project is configured for **Cloudflare Workers (SSR)** via the Astro Cloudflare adapter.

### GitHub Actions

Two workflows are provided:

- `.github/workflows/ci.yml`: runs `pnpm check` and `pnpm build` on pushes and PRs
- `.github/workflows/deploy.yml`: deploys to Cloudflare Workers on `publish` branch and creates PR previews

### Required GitHub Secrets

Add the following secrets in your GitHub repo:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### Production branch

Deployment triggers on the `publish` branch. Create and push it once:

```sh
git checkout -b publish
git push -u origin publish
```

### Preview URLs

PR previews deploy to worker names like `dynamic-pr-<PR number>`.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
