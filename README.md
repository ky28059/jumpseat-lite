# jumpseat-lite

An open-sourced fork of Jumpseat, built using Typescript, Next.js, and Prisma ORM.

At its core, Jumpseat is a wrapper around Google Flights that automatically pairs and includes shuttle costs and times
in itinerary ranking. Thus, Jumpseat might be useful if your school has one or more of the following:
- Multiple airports to fly to/from (for Purdue, this is IND and ORD)
- Infrequent airport transit that requires planning around (shuttles every 3 hours from ORD)
- Cost / time tradeoffs between airports (shuttles are faster + cheaper to IND, but flights are much more expensive)
- Multiple shuttle providers with different schedules

### Adding a new school
Adding schools to Jumpseat is easy: first, add the school to the metadata map in `./lib/schools.ts`. The type is:
```ts
export type SchoolConfig = {
    name: string,
    nameLong: string,
    coordinates: [lat: number, long: number],
    email: string,
    emailPlaceholder: string,
    passwordPlaceholder: string,
    excludedAirports: string[]
}
```
(look at the Purdue entry for an example); this will add the school to the home-page dropdown.

You will also need to insert the school into the database: create scripts `upsert-[school]-breaks.ts` and
`upsert-[school]-shuttles.ts` that add the school's breaks and shuttles to the DB, respectively (see the Purdue scripts
for an example). You will need to provide
- The airport IATAs Jumpseat should associate with your school.
- A list of (current year) school breaks, for Jumpseat to autofill as options on the search page.
- A list of shuttle providers and their routes; see the expected format in the `upsert-shuttles` scripts.

#### Updating school information
To update a school's breaks or shuttle information, simply make a pull request editing the appropriate `upsert-` script.
The data will automatically be updated on merge.

### Running locally
Create a `.env` in the project root exporting your Postgres database / serpapi key, Google Maps key, and Next Auth secret. This should look something like
```env
DATABASE_URL="prisma+postgres://..."
AUTH_SECRET=...
SERP_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=...
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

The database schema is stored in `/prisma/schema.prisma`. After editing this schema, run
```bash
npx prisma migrate dev
```
to migrate your changes to the remote database and regenerate Prisma's client typings.

### Google Maps setup
To generate a Google Maps key, go to [Google Cloud console](https://console.cloud.google.com/) and create a new project.
Under **APIs & Services**, enable the **Maps Javascript API**:

![image](https://github.com/user-attachments/assets/fca1aebc-1e60-4f00-8650-7ef2609b4416)

### Database setup
> Note: The below instructions assume a traditional Postgres database hosted on AWS RDS. Currently, for cost reasons,
> this project uses a Postgres database on Prisma using Prisma accelerate. To switch back to a traditional Postgres
> connection, add the `pg` adapter and remove the `withAccelerate()` plugin on all Prisma clients.

To set up the database on AWS, create an Aurora Postgres database through [RDS](https://us-east-2.console.aws.amazon.com/rds/home).

![image](https://github.com/user-attachments/assets/ffee257f-bbaf-4ecf-9912-3e7214ef0356)

Since the frontend is not deployed directly on AWS through EC2, we need to configure the database to accept external
connections. Follow [this guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_SettingUp_Aurora.html#CHAP_SettingUp_Aurora.SecurityGroup)
to add a security group in the VPC dashboard that allows inbound connections to `:5432`.

![image](https://github.com/user-attachments/assets/b9fd4821-62c8-40cd-803a-73cc7e244445)

Once the Aurora database is configured with the above security rule, we'll also need to modify the database *instance* to
allow public connections: under **Connectivity > Additional configuration** in the instance settings,

![image](https://github.com/user-attachments/assets/481811d0-09c9-4d2d-872c-c5f9acd66101)

Finally, you should be able to connect to your database externally, e.g. via `psql` with
```bash
psql --host=jumpseat.cluster-[...].us-east-2.rds.amazonaws.com --port=5432 --username=postgres
```
and your database master password (if you didn't create the database with one, you can always add one via the **Modify** menu).

(note: the `psql` host is the the Aurora *writer endpoint* as seen in the console here:)

![Screenshot 2025-05-02 003546](https://github.com/user-attachments/assets/e2f2ec8e-f81d-439e-bff4-07b6cb5f9248)

Set the `DATABASE_URL` in the `.env` to
```
postgres://postgres:[master password]@[aurora writer endpoint]:5432/postgres
```
as mentioned above, and run
```bash
npx prisma migrate dev
```
to set up the database with the initial migrations.

### Scripts

In the case that you *must* drop all data in the production database, you can run
```bash
npx tsx ./scripts/backup.ts
```
to create JSON backups of all tables in the database. Then, drop the tables as usual.

Restoring the database from the JSON backups is slightly more complex; in general, you want to restore "base" tables
before restoring tables with relations that reference them (for example, you'll need to restore `User` before `Friend`).

Manually edit `./scripts/recover.ts` to facilitate this, then run
```bash
npx tsx ./scripts/recover.ts
```
to redeploy your saved data.
