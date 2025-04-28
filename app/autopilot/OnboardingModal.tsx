"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "react-aria";
import SignInButton from "@/app/SignInButton";


// Utils
import { setUpAutopilot } from "@/lib/db/user";
import { SchoolConfig } from "@/lib/schools";


type OnboardingModalProps = {
    isSigned: boolean,
    setInAutopilot: Dispatch<SetStateAction<boolean>> | null,
    config?: SchoolConfig
}

export default function OnboardingModal({ isSigned, setInAutopilot, config }: OnboardingModalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [count, setCount] = useState(0);
    const [loginIsOpen, setLoginIsOpen] = useState(false);

    const handleClick = async () => {
        if (isSigned) {
            const setupResult = await setUpAutopilot();
            if (setupResult.ok) {
                if (setInAutopilot)
                    setInAutopilot(true);
            }
            else {
                console.error("could not set up autopilot");
            }
            return;
        }
        else {
            setLoginIsOpen(true);
        }
    };

    return (
        <div className="z-30">
            <SignInButton config={config} hasTrigger={false} isOpen={loginIsOpen} setIsOpen={setLoginIsOpen}/>
            <Dialog open={!loginIsOpen} modal={false}>
                <DialogContent
                    showCloseButton={false}
                    blurBackground
                    className="max-h-screen max-w-[90%] sm:max-w-[560px] flex flex-col justify-center bg-[#f6f9fc] dark:bg-[#141414]"
                    aria-describedby="autopilot"
                >
                    <VisuallyHidden>
                        <DialogTitle>
                            Autopilot Modal
                        </DialogTitle>
                    </VisuallyHidden>
                    <div className="flex flex-col items-center">
                        <h2 className="sm:text-2xl text-lg font-semibold">Unlock Autopilot</h2>
                    </div>

                    <div className="w-fit h-fit rounded-lg overflow-clip">
                        <video
                            src="/assets/autopilot_video.mp4"
                            width={1052}
                            height={720}
                            loop
                            autoPlay
                            muted
                            playsInline
                            disablePictureInPicture
                        />
                    </div>

                    <div className="px-10 h-fit my-4">
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem>
                                    <div className="flex flex-col items-center gap-2 sm:gap-4">
                                        <p className="text-sm sm:text-base text-center">
                                            Flight prices vary a lot—especially across dates, airports, and breaks. So we'll automatically set price trackers for all of your breaks.
                                        </p>
                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div className="flex flex-col items-center gap-2 sm:gap-4">
                                        <p className="text-sm sm:text-base text-center">
                                            We'll send you links to the right flights at the
                                            right time. You won't need to stress about expensive flight
                                            bookings back home again.
                                        </p>
                                    </div>
                                </CarouselItem>
                                <CarouselItem className="flex justify-center items-center">
                                    <div className="flex flex-col items-center gap-2 sm:gap-4">
                                        <p className="text-sm sm:text-base text-center">
                                            100% free. Save $100s.
                                        </p>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <button className="w-full p-2 bg-blue-500 text-white font-medium rounded-md text-sm sm:text-base" onClick={handleClick}>
                        {isSigned ? "Get Started" : "Sign in"}
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    )
}
