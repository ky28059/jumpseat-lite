import { useContext } from 'react';
import ComboCard from "@/app/results/ComboCard";
import ResultsContext from '@/contexts/ResultsContext';


type CombosSectionProps = {
    depShuttleIndex: number,
    retShuttleIndex: number
}
export default function CombosSection(props: CombosSectionProps) {
    const { depCombo, retCombo } = useContext(ResultsContext);

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold mb-0.5">
                Selected combos
            </h2>
            {depCombo && (
                <ComboCard
                    combo={depCombo}
                    shuttleIndex={props.depShuttleIndex}
                    finalize
                />
            )}
            {retCombo && (
                <ComboCard
                    combo={retCombo}
                    shuttleIndex={props.retShuttleIndex}
                    finalize
                />
            )}
        </div>
    )
}
