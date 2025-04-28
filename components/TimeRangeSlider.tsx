import * as Slider from '@radix-ui/react-slider';


type TimeRangeSliderProps = {
    minutes: number[],
    setMinutes: (m: number[]) => void
}
export default function TimeRangeSlider(props: TimeRangeSliderProps) {
    return (
        <Slider.Root
            className="relative flex w-full touch-none select-none items-center"
            value={props.minutes}
            onValueChange={props.setMinutes}
            min={0}
            max={1440}
            step={30}
            minStepsBetweenThumbs={1}
        >
            <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-tertiary">
                <Slider.Range className="absolute h-2 grow overflow-hidden rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb className="block size-2 box-content rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            <Slider.Thumb className="block size-2 box-content rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </Slider.Root>
    )
}
