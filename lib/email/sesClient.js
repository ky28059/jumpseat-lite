import { SESClient } from "@aws-sdk/client-ses";
// Set the AWS Region.
const REGION = "us-east-1";
// Create SES service object.
const sesPayload = {region: REGION, credentials: {accessKeyId: "AKIASM5CMMWHNIDRDEL2", secretAccessKey: "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"}}
const sesClient = new SESClient(sesPayload);
export { sesClient };
