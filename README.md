# jumpseat-lite

An open-sourced fork of Jumpseat, built using Typescript, Next.js, and Prisma ORM.

### Running locally
Create a `.env` in the project root exporting your Postgres database / serpapi key and Next Auth secret. This should look something like
```env
DATABASE_URL="postgres://postgres:...@...:5432/postgres"
AUTH_SECRET=...
SERP_KEY=...
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

### Database setup
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
