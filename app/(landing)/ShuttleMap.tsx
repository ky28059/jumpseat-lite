import { cookies, headers } from 'next/headers';

// Components
import Map from '@/components/map';

// Utils
import { hostToConfig } from '@/lib/schools';
import { THEME_COOKIE_NAME } from "@/lib/config";


export default function ShuttleMap() {
    const host = headers().get('Host');
    const config = hostToConfig(host);
    const theme = cookies().get(THEME_COOKIE_NAME)?.value;

    // TODO: default lat / long?
    const [lat, lng] = config?.coordinates ?? [40.4237095, -86.9237695];

    return (
        <div className="w-96 h-[36rem] border border-tertiary flex flex-none items-center justify-center text-secondary">
            <Map
                flightPlanCoordinates={[]}
                center={{ lat, lng }}
                theme={theme}
            />
        </div>
    )
}
