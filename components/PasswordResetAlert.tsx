import { Dialog, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { sendResetEmail } from "@/lib/email/emailer";
import { SchoolConfig } from "@/lib/schools";

interface EmailVerificationProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    config: SchoolConfig;
}

export default function ResetPasswordAlert({ isOpen, onClose, email, config }: EmailVerificationProps) {
    const router = useRouter();
    if (!isOpen) return null;
    const resendResetPassword = () => {
        sendResetEmail(email, config.name);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogHeader>
                <h2 className="text-xl font-bold">Check your email</h2>
                <p className="text-sm text-secondary">
                    We’ve sent a reset password link to your email address. Check your spam too. If you don't get it in a few minutes, please resend it.
                </p>
            </DialogHeader>
            <DialogFooter>
                <Button variant="secondary" onClick={resendResetPassword}>
                    Resend
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </DialogFooter>
        </Dialog>
    );
}

