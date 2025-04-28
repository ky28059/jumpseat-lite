import { FaArrowDown } from "react-icons/fa";
import PaymentInfo from "@/app/results/PaymentInfo";

export default function OneTapBuySection() {
    return (
        <div>
            <div className="flex flex-row items-center">
                <div className="w-full h-[1px] bg-gray-400" />
                <div className="flex flex-row gap-1 text-xs flex-none mx-2 items-center text-gray-400">
                    <p>or use One-tap-buy</p>
                    <FaArrowDown size={11} />
                </div>
                <div className="w-full h-[1px] bg-gray-400" />
            </div>
            <p className="text-sm mt-1">
                Buy your flights and shuttles in one go, although it'll cost $X due to credit card processing fees
                and any cancellations would have to go through us. But if you'd still like to book quickly and get
                one comprehensive email/itinerary, then this feature is for you.
            </p>
            <PaymentInfo />
        </div>
    )
}
