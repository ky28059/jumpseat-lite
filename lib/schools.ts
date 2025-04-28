export type SchoolConfig = {
    name: string,
    nameLong: string,
    coordinates: [lat: number, long: number],
    email: string,
    emailPlaceholder: string,
    passwordPlaceholder: string,
    dbID: number,
    excludedAirports: string[]
}

export const schoolConfigs: { [key: string]: SchoolConfig } = {
    'purdue.jumpseatapp.com': {
        name: 'Purdue',
        nameLong: "Purdue University",
        coordinates: [40.4237095, -86.9237695],
        email: 'purdue.edu',
        emailPlaceholder: 'bruhbruh25@gmail.com',
        passwordPlaceholder: 'Belltower_26',
        dbID: 1,
        excludedAirports: ["ORD", "IND", "MDW"]
    },
    'iu.jumpseatapp.com': {
        name: 'IU',
        nameLong: "Indiana University",
        coordinates: [39.7739331, -86.1788355],
        email: 'iu.edu',
        emailPlaceholder: 'bruhbruh25@gmail.com',
        passwordPlaceholder: 'Samplegates_26',
        dbID: 2,
        excludedAirports: ["ORD", "IND", "MDW"]
    },
    'uiuc.jumpseatapp.com': {
        name: 'UIUC',
        nameLong: "University of Illinois Urbana-Champaign",
        coordinates: [40.1019564, -88.2297364],
        email: 'illinois.edu',
        emailPlaceholder: 'bruhbruh25@gmail.com',
        passwordPlaceholder: 'ILL-ini_26',
        dbID: 4,
        excludedAirports: ["ORD", "IND", "MDW"]
    },
    // 'umich.jumpseatapp.com': {
    //     name: 'UMich',
    //     nameLong: 'University of Michigan',
    //     coordinates: [42.2771489, -83.740782]
    // },
    // 'nd.jumpseatapp.com': {
    //     name: 'Notre Dame',
    //     nameLong: 'Notre Dame University',
    //     coordinates: [41.6994871, -86.2399426]
    // },
}

export function hostToConfig(host: string | null) {
    // Dev override for testing purposes
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
        return schoolConfigs['purdue.jumpseatapp.com']

    if (!host) return;
    return schoolConfigs[host];
}
