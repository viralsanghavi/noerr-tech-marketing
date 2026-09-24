# no.err marketing site

Remix + Vite, built as a client-rendered SPA (`ssr: false`) and served as static
files from Firebase Hosting. Site copy lives in Sanity.

## Development

```sh
npm run dev
```

Content comes from the committed snapshot at `app/data/generated/content.json`,
so dev works offline and without Sanity credentials.

## Content

Copy is edited in the Sanity Studio at [noerrtech.sanity.studio](https://noerrtech.sanity.studio).
Its source lives in `studio-noerr-tech/` in this repo — a separate app with its
own dependencies, so run `npm install` in there before `npm run dev` or
`npx sanity deploy`.

Because there is no server at runtime, **content is baked in at build time — an
edit is not live until the site is rebuilt and redeployed.**

```sh
npm run content        # pull from Sanity into app/data/generated/content.json
npm run build:content  # pull, then build
```

`npm run content` validates everything it fetches and writes nothing if the
content is unusable, so a bad fetch can't overwrite a good snapshot. Validation
is strict on purpose — every list requires at least one item, so the silent
failure mode (a wrong dataset or unpublished drafts blanking a section) becomes a
visible error. It also fails on a project whose media is missing from
`public/work`.

Commit the regenerated `content.json` — it is the snapshot every build starts from.

`app/data/site.ts` adapts that JSON into the shapes in `app/data/types.ts`, and
`app/routes/_index.tsx` is the only module that reads it — every section takes
plain props.

Ordering is whatever the Studio's drag-and-drop lists say. The work strip derives
its `01…07` numbering and its pinned-scroll height from list position, so adding
or reordering projects needs no code change.

### Project media

Posters and clips are **not** in Sanity — Sanity file assets are served as raw
downloads with no transcoding, which is the wrong home for autoplaying video.
They live in `public/work`, keyed by each project's `mediaSlug`:

```sh
npm run capture -- <mediaSlug> <url> --depth=4
```

That writes `<mediaSlug>.jpg` (2880×1800 poster), `.mp4` and `.webm`
(960×600, 24fps, 3s). Adding a project in the Studio still needs this one step
in the repo, or its panel renders a missing poster.

## Deployment

```sh
npm run build
firebase deploy --only hosting
```

`.github/workflows/deploy.yml` does this automatically on push to `main`, and on
a `repository_dispatch` from the Sanity webhook so content edits redeploy. It
needs one repository secret, `FIREBASE_SERVICE_ACCOUNT`; see the workflow file.
