export type SchoolConfig = {
    name: string,
    nameLong: string,
    coordinates: [lat: number, long: number],
    email: string,
    emailPlaceholder: string,
    passwordPlaceholder: string,
    excludedAirports: string[]
}

export const schoolConfigs: { [key: string]: SchoolConfig } = {
    'purdue': {
        name: 'Purdue',
        nameLong: "Purdue University",
        coordinates: [40.4237095, -86.9237695],
        email: 'purdue.edu',
        emailPlaceholder: 'pete37@purdue.edu',
        passwordPlaceholder: 'Belltower_26',
        excludedAirports: ["ORD", "IND", "MDW"]
    },
    // 'iu': {
    //     name: 'IU',
    //     nameLong: "Indiana University",
    //     coordinates: [39.7739331, -86.1788355],
    //     email: 'iu.edu',
    //     emailPlaceholder: 'bruhbruh25@gmail.com',
    //     passwordPlaceholder: 'Samplegates_26',
    //     excludedAirports: ["ORD", "IND", "MDW"]
    // },
    'uiuc': {
        name: 'UIUC',
        nameLong: "University of Illinois Urbana-Champaign",
        coordinates: [40.1019564, -88.2297364],
        email: 'illinois.edu',
        emailPlaceholder: 'fisher@illinois.edu',
        passwordPlaceholder: 'ILL-ini_26',
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

export function schoolToConfig(cookie: string | undefined) {
    if (!cookie) return schoolConfigs['purdue'];
    return schoolConfigs[cookie];
}
