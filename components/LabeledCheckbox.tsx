import {ReactNode} from "react";
import { Checkbox } from '@/components/ui/checkbox';

type LabeledCheckboxProps = {
    id: string,
    checked: boolean,
    disabled?: boolean,
    onChange: (c: boolean) => void,
    children: ReactNode
}

export default function LabeledCheckbox(props: LabeledCheckboxProps) {
    return (
        <div className="flex gap-2 items-center mb-2">
            <Checkbox
                id={props.id}
                checked={props.checked}
                disabled={props.disabled}
                onCheckedChange={(e) => typeof e === 'boolean' && props.onChange(e)}
            />
            <label
                className="text-sm"
                htmlFor={props.id}
            >
                {props.children}
            </label>
        </div>
    )
}