# bookings-frontend

The frontend for Jumpseat.

### Running locally
Create a `.env` in the project root exporting your Postgres database / serpapi key, Next Auth secret, and PostHog keys. This should look something like
```env
DATABASE_URL="postgres://postgres:...@...:5432/postgres"
AUTH_SECRET=...
SERP_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=...
NEXT_PUBLIC_POSTHOG_HOST=...
```
Run
```bash
npm i
```
to install dependencies,
```bash
npx prisma generate
```
to generate typings for the Prisma client, and
```bash
npm run dev
```
to start the development server on `localhost:3000`.

The database schema is stored in `/prisma/schema.prisma`. After editing, run
```bash
npx prisma migrate dev
```
to push the new schema to the remote database and regenerate client typings.

### Scripts

In the case that you *must* drop all data in the production database, you can run
```bash
node ./scripts/backup.js
```
to create JSON backups of all tables in the database. Then, drop the tables as usual.

Restoring the database from the JSON backups is slightly more complex; in general, you want to restore "base" tables
before restoring tables with relations that reference them (for example, you'll need to restore `User` before `Friend`).

Manually edit `./scripts/recover.js` to facilitate this, then run
```bash
node ./scripts/recover.js
```
to redeploy your saved data.
