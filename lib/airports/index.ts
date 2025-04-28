import { readFileSync } from 'node:fs';


export type Airport = {
    iata: string,
    name: string,
    city: string,
    zone: string, // IANA tz
    lat: number,
    lon: number,
    size: number
}
export const airportMap: { [iata: string]: Airport } = {};
export const airportLocationMap: { [loc: string]: Airport[] } = {};

// https://vercel.com/guides/loading-static-file-nextjs-api-route
const enplanementCsvLines = readFileSync(process.cwd() + '/lib/airports/enplanements.csv').toString().split('\n').slice(1);

const enplanementMap: { [iata: string]: number } = {};
for (const [rank, iata, city, name, hub, raw] of enplanementCsvLines.map(s => s.split(','))) {
    enplanementMap[iata] = Number(raw);
}

const airportCsvLines = readFileSync(process.cwd() + '/lib/airports/airports.csv').toString().split('\n').slice(1);

for (const line of airportCsvLines) {
    const [icao, iata, name, city, subd, country, elevation, lat, lon, tz, lid] = line.replaceAll('"', '').split(',');
    if (!iata) continue;

    const airport: Airport = {
        iata,
        name: name // Shorten CSV airport name somewhat
            .replaceAll('International', 'Intl')
            .replaceAll('Airport', ''),
        city: city || subd,
        zone: tz,
        lat: Number(lat),
        lon: Number(lon),
        size: enplanementMap[iata] ?? -1
    }
    airportMap[iata] = airport;

    // TODO: exclude city if empty
    const location = `${city}, ${subd}, ${country}`;
    if (!airportLocationMap[location]) airportLocationMap[location] = [];
    airportLocationMap[location].push(airport);
}
