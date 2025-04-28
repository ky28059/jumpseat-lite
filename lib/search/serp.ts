'use server';

export type Itinerary = {
    flights: Flight[],
    layovers?: Layover[]
    total_duration: number, // minutes
    carbon_emissions: {
        this_flight: number,
        typical_for_this_route?: number,
        difference_percent?: number
    },
    price: number, // USD
    type: "Round trip" | "One way",
    airline_logo: string,

    departure_token?: string,
    booking_token?: string,
}

type Flight = {
    departure_airport: AirportInfo,
    arrival_airport: AirportInfo,
    duration: number, // minutes
    airplane: string,
    airline: string, // IATA
    airline_logo: string,
    travel_class: string,
    flight_number: string,
    legroom: string,
    extensions: string[]
}

type Layover = {
    duration: number, // minutes
    name: string,
    id: string // IATA
}

type AirportInfo = {
    name: string,
    id: string, // IATA
    time: string // "almost ISO"
}

export type SerpFlightsResponse = {
    search_metadata: {
        id: string,
        status: "Success",
        json_endpoint: string,
        created_at: string, // "YYYY-MM-DD HH:MM:SS UTC"
        processed_at: string, // "YYYY-MM-DD HH:MM:SS UTC"
        google_flights_url: string,
        raw_html_file: string,
        prettify_html_file: string,
        total_time_taken: number
    },
    search_parameters: {
        engine: "google_flights",
        hl: "en",
        departure_id: string,
        arrival_id: string,
        outbound_date: string, // ISO
        return_date: string, // ISO
        currency: "USD"
    },
    best_flights?: Itinerary[],
    other_flights: Itinerary[],
    price_insights: {
        lowest_price: number,
        price_level: "high" | "typical", // TODO
        typical_price_range: [number, number],
        price_history: [timestamp: number, price: number][]
    }
}

type BookingRequest = {
    url: "https://www.google.com/travel/clk/f",
    post_data: string
}

export type BookingOption = {
    separate_tickets?: boolean,
    departing?: {
        booking_request: BookingRequest
    },
    returning?: {
        booking_request: BookingRequest
    }
    together: {
        book_with: string,
        airline_logos: string[],
        marketed_as: [
            "BA 303",
            "BA 328"
        ],
        price: 188,
        local_prices: { currency: string, price: number }[],
        option_title: "Basic Economy",
        extensions: string[],
        baggage_prices?: string[],
        booking_request: BookingRequest
    }
}

type SerpBookingsResponse = {
    selected_flights: Itinerary[],
    baggage_prices: {
        together: [
            "1 free carry-on",
            "1st checked bag: 99-187"
        ]
    },
    booking_options: BookingOption[],
    price_insights: { // TODO
        lowest_price: 188,
        price_level: "typical",
        typical_price_range: [
            165,
            500
        ]
    }
}

export async function getFlights(
    roundTrip: boolean,
    depIatas: string[],
    arrIatas: string[],
    depDate: string, // ISO
    carryCnt: number,
    checkCnt: number,
    arrDate?: string, // ISO
    departureToken?: string,
): Promise<SerpFlightsResponse> {
    const type = roundTrip ? 1 : 2;

    return (await fetch(
        `https://serpapi.com/search.json?engine=google_flights`
        + `&departure_id=${depIatas.join(',')}&arrival_id=${arrIatas.join(',')}`
        + `&outbound_date=${depDate}&type=${type}`
        + (roundTrip && arrDate ? `&return_date=${arrDate}` : '')
        + (departureToken ? `&departure_token=${departureToken}` : '')
        + `&api_key=${process.env.SERP_KEY}`
        + `&currency=USD&hl=en&show_hidden=true`
        + `&bags=${carryCnt}`
    )).json()
}

export async function getBookings(
    bookingToken: string,
    roundTrip: boolean,
    depIatas: string[],
    arrIatas: string[],
    depDate: string, // ISO
    arrDate?: string, // ISO
): Promise<SerpBookingsResponse> {
    const type = roundTrip ? 1 : 2;

    return (await fetch(
        `https://serpapi.com/search.json?engine=google_flights`
        + `&departure_id=${depIatas.join(',')}&arrival_id=${arrIatas.join(',')}`
        + `&outbound_date=${depDate}&type=${type}`
        + (roundTrip && arrDate ? `&return_date=${arrDate}` : '')
        + `&booking_token=${bookingToken}`
        + `&api_key=${process.env.SERP_KEY}`
        + `&currency=USD&hl=en&show_hidden=true`
    )).json()
}

export async function getBookingHref(req: BookingRequest) {
    const raw = await (await fetch(req.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: req.post_data
    })).text()

    return raw.match(/url='(.+?)'/)?.[1]?.replaceAll('&amp;', '&');
}
