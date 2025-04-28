import type { Metadata } from "next";
import type { ReactNode } from "react";


export const metadata: Metadata = {
    title: "About",
};

export default function About() {
    return (
        <main className="pt-28 pb-20 container">
            <h1 className="font-bold text-4xl mb-6">About Jumpseat</h1>
            <p className="mb-12">We’re a travel platform for college students, built by college students.</p>

            <h2 className="font-semibold text-xl mb-6">Developer team</h2>
            <div className="table mb-8">
                <TeamMember name="Ethan">Search, Collecting all AWS permissions</TeamMember>
                <TeamMember name="Kevin">Search, o7</TeamMember>
                <TeamMember name="Leyton">Search, Expert at git commit descriptions</TeamMember>
                <TeamMember name="Rithwik">Search, Aero major</TeamMember>

                <TeamMember name="Nishaant" section>Autopilot, Can’t tell when he’s being sarcastic</TeamMember>
                <TeamMember name="Pradyun">
                    Autopilot, Gambling addict
                </TeamMember>
                <TeamMember name="Tejas">Autopilot, GTech fella</TeamMember>

                <TeamMember name="Arnav" section>
                    Portal, "Did you know I'm working at Coinbase this summer?"
                </TeamMember>
                <TeamMember name="Kush">Portal, Kush</TeamMember>
                <TeamMember name="Siddhanth">Portal, Qdoba intern</TeamMember>
                <TeamMember name="Vraj">Portal, Nishaant's friend</TeamMember>

                <br />
                <span className="font-semibold">Honorable Mention</span>
                <TeamMember name="Eric">Portal, Robbed at Chipotle</TeamMember>
            </div>

            <p>
                Contact us at{" "}
                <a className="text-theme hover:underline" href="mailto:team@jumpseatapp.com">
                    team@jumpseatapp.com
                </a>
                .
            </p>
        </main>
    );
}

type TeamMemberProps = {
    name: string,
    children: ReactNode,
    section?: boolean,
};
function TeamMember(props: TeamMemberProps) {
    return (
        <div className="table-row">
            <p className={"table-cell font-semibold pr-12" + (props.section ? " pt-4" : "")}>
                {props.name}
            </p>
            <p className="table-cell text-sm">
                {props.children}
            </p>
        </div>
    );
}
