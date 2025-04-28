"use server";

import { Duffel } from "@duffel/api";
import { CreateOfferRequest, CreateOfferRequestQueryParameters } from "@duffel/api/types";

const duffel = new Duffel({ token: process.env.DUFFEL_KEY! });


export async function createPaymentIntent(amount: string) {
    try {
        const paymentIntent = await duffel.paymentIntents.create({
            amount: amount,
            currency: "USD",
        });
        return { pint: paymentIntent, status: 200 };
    } catch (e) {
        console.log(e);
        return { error: e, status: 500 };
    }
}

export async function retrieveOffer(offerID: string) {
    try {
        const offer = await duffel.offers.get(offerID, {
            return_available_services: true,
        });
        return { offer: offer, status: 200 };
    } catch (e) {
        console.log(e);
        return { error: e, status: 500 };
    }
}

export async function listOffers(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string | undefined
) {
    const slices = [
        {
            origin: origin,
            destination: destination,
            departure_date: departureDate,
        },
    ];
    if (returnDate != undefined) {
        slices.push({
            origin: destination,
            destination: origin,
            departure_date: returnDate,
        });
    }
    const offerRequestParams: CreateOfferRequest &
        CreateOfferRequestQueryParameters = {
        slices: slices,
        passengers: [
            {
                age: 18,
            },
        ],
        cabin_class: "economy",
        max_connections: 1,
    };
    try {
        const offerRequest = await duffel.offerRequests.create(offerRequestParams);
        const offers = await duffel.offers.list({
            offer_request_id: offerRequest.data.id,
            sort: "total_amount",
        });
        return { offers: offers, status: 200 };
    } catch (e) {
        console.log(e);
        return { error: e, status: 500 };
    }
}
