
import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";


interface HackerFareModalProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    hackerFareLinks: string[];
}

export default function HackerFareModal(props: HackerFareModalProps) {
    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent className="px-8">
                <DialogHeader>
                    <h1 className="text-2xl font-bold mb-1">Hacker fare</h1>
                    <p className="text-sm text-secondary">These are two different routes so you'll have to book them separately.</p>
                </DialogHeader>

                <Button className="w-full" onClick={() => {window.open(props.hackerFareLinks[0])}}>
                    Departure
                </Button>
                <Button className="w-full" onClick={() => {window.open(props.hackerFareLinks[1])}}>
                    Return
                </Button>
            </DialogContent>
        </Dialog>
    )
}