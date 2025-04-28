import { ReactNode, useContext } from 'react';

// Components
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// Contexts
import ResultsContext, { ResultsStage } from '@/contexts/ResultsContext';

// Utils
import { cn } from '@/lib/utils';


type ResultsBreadcrumbsProps = {
    setStage: (s: ResultsStage) => void,
}
export default function ResultsBreadcrumbs(props: ResultsBreadcrumbsProps) {
    const { roundTrip, depCombo, retCombo } = useContext(ResultsContext);

    return (
        <Breadcrumb className="mb-12 relative z-10">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink
                        className="text-secondary hover:text-primary transition duration-200"
                        href="/search"
                    >
                        Search
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                <ResultsBreadcrumbStage {...props} value={ResultsStage.DEPARTURE}>
                    Departure
                </ResultsBreadcrumbStage>
                <BreadcrumbSeparator />

                {roundTrip && (
                    <>
                        <ResultsBreadcrumbStage
                            {...props}
                            value={ResultsStage.RETURN}
                            disabled={!depCombo}
                        >
                            Return
                        </ResultsBreadcrumbStage>
                        <BreadcrumbSeparator />
                    </>
                )}

                <ResultsBreadcrumbStage
                    {...props}
                    value={ResultsStage.FINALIZE}
                    disabled={(roundTrip && !retCombo) || !depCombo}
                >
                    Finalize
                </ResultsBreadcrumbStage>
            </BreadcrumbList>
        </Breadcrumb>
    )
}

type ResultsBreadcrumbStageProps = {
    value: ResultsStage,
    setStage: (s: ResultsStage) => void,
    children: ReactNode,
    disabled?: boolean
}
function ResultsBreadcrumbStage(props: ResultsBreadcrumbStageProps) {
    const { stage } = useContext(ResultsContext);
    const active = props.value === stage;

    return (
        <BreadcrumbItem className={cn(props.disabled && 'pointer-events-none opacity-50')}>
            {active ? (
                <BreadcrumbPage className="font-semibold">
                    {props.children}
                </BreadcrumbPage>
            ) : (
                <BreadcrumbPage
                    className="cursor-pointer text-secondary hover:text-primary transition duration-200"
                    onClick={() => props.setStage(props.value)}
                >
                    {props.children}
                </BreadcrumbPage>
            )}
        </BreadcrumbItem>
    )
}
