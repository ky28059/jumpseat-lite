"use client";

import React, {useState, useEffect, ChangeEvent} from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Input} from "@/components/ui/input";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?(-?\s?[0-9])+$/
);

const FormSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name must be at least 1 character.",
    }),
    lastName: z.string().min(1, {
        message: "Last name must be at least 1 character.",
    }),
    dob: z.date({
        required_error: "A date of birth is required.",
    }),
    email: z.string()
        .min(1, {message: "This field has to be filled."})
        .email("This is not a valid email.")
    ,
    phoneNumber: z.string().min(2, {
        message: "Phone number must be at least 2 characters.",
    }).regex(phoneRegex, "Not a valid phone number."),
})

const isValidPhoneNumber = (number: string) => {
    if (parseInt(number) > 9999999999) {
        return false;
    }

    const pattern = /^[0-9]+$/;
    return pattern.test(String(number));
};

export default function PaymentInfo() {
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [title, setTitle] = useState("Mr.");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [offerResponse, setOfferResponse] = useState(null);
    const [testOffer, setTestOffer] = useState(null);
    const [creatingPaymentIntent, setCreatingPaymentIntent] = useState(true);
    const [paymentIntent, setPaymentIntent] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Submitted", JSON.stringify(data, null, 2))
    }

    const handlePhoneNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newNumber = event.target.value;
        if (isValidPhoneNumber(newNumber) || newNumber === "") {
            setPhoneNumber(newNumber);
        }
    };

    // async function fetchOffers() {
    //     console.log("token", process.env.NEXT_PUBLIC_DUFFEL_API_KEY);
    //
    //     try {
    //         console.log(props.depObj.flight.info.id);
    //         const param1 = props.depObj.flight.info.id;
    //         let param2 = null;
    //
    //         if (props.retObj != null) {
    //             param2 = props.retObj.flight.info.id;
    //         }
    //
    //         const response = await axios.post("api/getOffer", {
    //             param1: param1.trim(),
    //             param2: param2,
    //         });
    //
    //         setOfferResponse(response);
    //         console.log("response from get offer", response);
    //         return response;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // async function createPaymentIntent(amount) {
    //     try {
    //         const response = await axios.post("api/createPaymentIntent", {
    //             amount: amount,
    //         });
    //
    //         console.log("response from payment intent", response);
    //         return response;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // const sendEmail = async () => {
    //     try {
    //         const response = axios.post("api/sendEmail", {
    //             testData: {
    //                 personalizations: [
    //                     {
    //                         to: [
    //                             {
    //                                 email: "siddhanth.kumar@gmail.com",
    //                                 name: "Siddhanth Kumar",
    //                             },
    //                         ],
    //                     },
    //                 ],
    //                 from: {
    //                     email: "campusventuresofficial@gmail.com",
    //                     name: "BoilerBookings",
    //                 },
    //                 subject: "Booking Confirmation #123456",
    //                 content: [
    //                     {
    //                         type: "text/html",
    //                         value: generateEmail("", "", "", "", "", "", "", 1, 1, 1),
    //                     },
    //                 ],
    //             },
    //         });
    //         return response;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // async function confirmPaymenIntent(id) {
    //     try {
    //         const response = await axios.post("api/confirmPaymentIntent", {
    //             id: id,
    //         });
    //         console.log("confirmed payment intent", response);
    //         return response;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // async function createOrder(
    //     offerID,
    //     paymentAmount,
    //     phoneNumber,
    //     email,
    //     birthdate,
    //     title,
    //     lastname,
    //     firstname,
    //     pasID,
    //     gender,
    //     payID
    // ) {
    //     try {
    //         const response = await axios.post("api/createOrder", {
    //             offerID: offerID,
    //             paymentAmount: paymentAmount,
    //             phoneNumber: phoneNumber,
    //             email: email,
    //             birthdate: birthdate,
    //             title: title,
    //             lastname: lastname,
    //             firstname: firstname,
    //             pasID: pasID,
    //             gender: gender,
    //             payID: payID,
    //         });
    //         console.log(response);
    //         return response;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // const calcAmount = async (depObj, retObj) => {
    //     console.log("depobj into calc amount", depObj);
    //     console.log("retObj into calc amount", retObj);
    //
    //     // one way flight
    //     if (retObj == null) {
    //         return depObj.data.total_amount;
    //     }
    //
    //     console.log("this is NOT parsed depObj total amount", depObj.data.total_amount);
    //     console.log("this is parsed depObj total amount", parseInt(depObj.data.total_amount));
    //
    //     const totalAmount =
    //         parseFloat(depObj.data.total_amount) + parseFloat(retObj.data.total_amount);
    //
    //     console.log("this is total amount without tostring", totalAmount);
    //
    //     console.log("this what calc gives", totalAmount.toFixed(2));
    //
    //     return totalAmount.toFixed(2);
    // };

    // useEffect(() => {
    //     async function run() {
    //         const res = await fetchOffers();
    //         console.log("real offers", res.data.res);
    //
    //         const totalAmount = await calcAmount(res.data.res.depOffer, res.data.res.retOffer);
    //
    //         console.log("this is what totalamount variable is", totalAmount);
    //         console.log(typeof totalAmount);
    //
    //         const res2 = await createPaymentIntent(totalAmount);
    //         console.log("final pint", res2);
    //         setCreatingPaymentIntent(false);
    //         setPaymentIntent(res2.data.res.data);
    //         console.log("pint client token", res2.data.res.data.client_token);
    //     }
    //
    //     run();
    // }, []);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-row gap-2 w-full">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="First name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Last name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-row gap-2 w-full">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone number" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date of birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown-buttons"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            fromYear={1900}
                                            toYear={new Date().getFullYear()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="bg-blue-500 w-full">Pay</Button>
                </form>
            </Form>
            {/*{creatingPaymentIntent ? (*/}
            {/*    <LoadingBubble key={0}/>*/}
            {/*) : (*/}
            {/*    <div className="flex justify-center mt-6">*/}
            {/*        <DuffelPayments*/}
            {/*            paymentIntentClientToken={paymentIntent.client_token}*/}
            {/*            onSuccessfulPayment={async () => {*/}
            {/*                // confirm payment intent*/}
            {/*                console.log("onsuccessfulpayment");*/}
            {/*                const response = await confirmPaymenIntent(paymentIntent.id);*/}
            {/*                console.log(response);*/}
            {/*                console.log("payment successfully collected");*/}
            {/*            }}*/}
            {/*            onFailedPayment={async (err) => {*/}
            {/*                console.log(err);*/}
            {/*                alert("The payment has not gone through.");*/}

            {/*                const response = await createOrder(*/}
            {/*                    testOffer.id,*/}
            {/*                    paymentIntent.amount,*/}
            {/*                    "9496777950",*/}
            {/*                    "siddhanth@gmail.com",*/}
            {/*                    "1987-07-24",*/}
            {/*                    "mr",*/}
            {/*                    "kumar",*/}
            {/*                    "siddhanth",*/}
            {/*                    testOffer?.passengers[0].id,*/}
            {/*                    "m",*/}
            {/*                    paymentIntent.id*/}
            {/*                );*/}

            {/*                alert("simulated order booked");*/}
            {/*                console.log(response);*/}

            {/*                sendEmail();*/}

            {/*                alert("email sent");*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*)}*/}
        </>
    );
}
