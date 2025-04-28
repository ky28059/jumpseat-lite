import { useContext, useEffect, useState } from 'react';

// Components
import CombosSection from "@/app/results/CombosSection";
import BookingDetail from '@/app/results/BookingDetail';
import ShuttleBookingDetail from '@/app/results/ShuttleBookingDetail';
import Spinner from '@/components/Spinner';

// Utils
import { BookingOption, getBookings } from '@/lib/search/serp';
import ResultsContext, { ResultsStage } from '@/contexts/ResultsContext';

// Icons
import { GoDotFill } from "react-icons/go";


type FinalizeContentProps = {
    from: string,
    to: string,

    depShuttleIndex: number,
    retShuttleIndex: number

    hidden: boolean
}

export default function FinalizeContent(props: FinalizeContentProps) {
    const { roundTrip, depDate, direction, intAirports, extAirports, retDate, depCombo, retCombo, stage } = useContext(ResultsContext);

    const [options, setOptions] = useState<BookingOption[]>([]);

    // Generate the booking token after flights are selected.
    useEffect(() => {
        if (!depCombo) return;
        if (roundTrip && !retCombo) return;

        const lastFlight = roundTrip ? retCombo : depCombo;
        const depIatas = direction == "toSchool"
            ? extAirports
            : intAirports;
        const arrIatas = direction == "toSchool"
            ? intAirports
            : extAirports;

        getBookings(
            lastFlight?.itinerary.booking_token!,
            roundTrip,
            depIatas,
            arrIatas,
            depDate,
            retDate
        ).then((b) => {
            setOptions(b.booking_options);
        });
    }, [depCombo, retCombo])

    // Reset options if user goes back to departure / return pages.
    useEffect(() => {
        if (stage === ResultsStage.FINALIZE) return;
        setOptions([]);
    }, [stage]);

    if (props.hidden) return null;

    const flightPrice = retCombo?.itinerary.price
        ?? depCombo?.itinerary.price
        ?? 0;
    
    const depShuttle = depCombo?.shuttleOptions[props.depShuttleIndex];
    const retShuttle = retCombo?.shuttleOptions[props.retShuttleIndex];

    const sameProvider = roundTrip
        && depShuttle?.airport === retShuttle?.airport
        && depShuttle?.providerID === retShuttle?.providerID;

    const depShuttlePrice = depCombo?.shuttleOptions[props.depShuttleIndex].price ?? 0;
    const retShuttlePrice = retCombo?.shuttleOptions[props.retShuttleIndex].price ?? 0;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-semibold">
                        {props.from}
                        {roundTrip ? ' <-> ' : ' -> '}
                        {props.to}
                    </h1>
                    <div className="flex flex-row items-center gap-1 text-secondary">
                        <p>{roundTrip ? "Round Trip" : "One Way"}</p>
                        <GoDotFill size={10} />
                        <p>Economy</p>
                    </div>
                </div>
                <h1 className="text-xl font-semibold">
                    ${flightPrice + depShuttlePrice + retShuttlePrice}
                </h1>
            </div>

            <CombosSection
                depShuttleIndex={props.depShuttleIndex}
                retShuttleIndex={props.retShuttleIndex}
            />

            <section className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold mt-4">
                    Shuttle links
                </h1>
                <p className="text-secondary">
                    Make sure your shuttle(s) are available before booking your flight(s).
                </p>

                {depCombo && (
                    <ShuttleBookingDetail
                        combo={depCombo}
                        shuttleIndex={props.depShuttleIndex}
                        addedPrice={sameProvider ? retShuttle!.price : 0}
                    />
                )}
                {retCombo && !sameProvider && (
                    <ShuttleBookingDetail
                        return
                        combo={retCombo}
                        shuttleIndex={props.retShuttleIndex}
                    />
                )}
            </section>

            <section className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold mt-4">
                    Flight links
                </h1>
                <p className="text-secondary">
                    Booking options for departure / return flight(s). You only need to book one.
                </p>

                {options.length === 0 ? (
                    <div className="flex items-center gap-4 py-4 text-secondary">
                        <Spinner />
                        Loading flight links...
                    </div>
                ) : options.map(o => (
                    <BookingDetail
                        {...o}
                        key={o.separate_tickets ? o.departing!.booking_request.post_data : o.together.booking_request.post_data}
                    />
                ))}
            </section>

            {/*<OneTapBuySection/>*/}
        </div>
    )
}
