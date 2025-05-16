import { Dialog, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Utils
// import { sendVerificationEmail } from "@/lib/email/emailer";
import type { SchoolConfig } from "@/lib/schools";


type EmailVerificationProps = {
    isOpen: boolean,
    onClose: () => void,
    config: SchoolConfig,
    email: string,
}

export default function EmailVerification({ isOpen, onClose, config, email }: EmailVerificationProps) {
    if (!isOpen) return null;

    const resendVerification = () => {
        // sendVerificationEmail(email, config.name);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <h2 className="text-xl font-bold">Check your email</h2>
                <p className="text-sm text-secondary">
                    We’ve sent a verification link to your email address. Check your spam too. If you don't get it in a few minutes, please resend it.
                </p>
            </DialogHeader>
            <DialogFooter>
                <Button variant="secondary" onClick={resendVerification}>
                    Resend
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
