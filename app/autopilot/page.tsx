import type { Metadata } from "next";
import { headers } from "next/headers";

// Components
import OnboardingModal from "@/app/autopilot/OnboardingModal";
import AutopilotContent from "@/app/autopilot/AutopilotContent";

// Utils
import { auth } from "@/auth";
import { getUserById } from "@/lib/db/user";

import { testUser } from "@/app/autopilot/AutopilotContent";
import { hostToConfig } from "@/lib/schools";


export const metadata: Metadata = {
    title: "Autopilot",
};

export default async function Autopilot() {
    const session = await auth();
    const host = headers().get("Host");
    const config = hostToConfig(host);

    if (!session || !session.user || !session.user.id) {
        return (
            <div className="flex flex-col items-center h-full text-secondary pb-16">
                <AutopilotContent user={testUser} isTest={true} />
                <OnboardingModal isSigned={false} setInAutopilot={null} config={config} />
            </div>
        )
    }

    const user = await getUserById(Number(session.user.id));

    if (!user) {
        return "error loading user";
    }

    return (
        <div className="flex flex-col items-center h-full text-secondary pb-16">
            <AutopilotContent
                user={user}
                isTest={false}
                config={config}
            />
        </div>
    )
}
