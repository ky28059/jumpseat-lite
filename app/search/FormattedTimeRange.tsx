import { DateTime } from 'luxon';
import { cn } from '@/lib/utils';


type FormattedTimeRangeProps = {
    depTime: DateTime,
    arrTime: DateTime,
    className?: string
}
export default function FormattedTimeRange(props: FormattedTimeRangeProps) {
    const showFirstTimezone = !props.depTime.zone.equals(props.arrTime.zone);

    const formattedDepTime = props.depTime.setLocale('en-us').toLocaleString({
        hour: "numeric",
        minute: "numeric",
    });
    const formattedArrTime = props.arrTime.setLocale('en-us').toLocaleString({
        hour: "numeric",
        minute: "numeric",
    });

    return (
        <p className={cn("leading-5 text-pretty", props.className)}>
            {formattedDepTime}{' '}
            {showFirstTimezone && (
                <sup className="text-[10px] text-secondary">
                    {props.depTime.zone.offsetName(props.depTime.valueOf(), { format: 'short' })}
                </sup>
            )}
            {' - '}
            {formattedArrTime}{' '}
            <sup className="text-[10px] text-secondary">
                {props.arrTime.zone.offsetName(props.depTime.valueOf(), { format: 'short' })}
            </sup>
        </p>
    );
}
