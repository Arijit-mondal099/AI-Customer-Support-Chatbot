import { Scalekit } from "@scalekit-sdk/node";
import { ENV } from "./env";

export const scalekit = new Scalekit(
  ENV.SCALEKIT_ENVIRONMENT_URL,
  ENV.SCALEKIT_CLIENT_ID,
  ENV.SCALEKIT_CLIENT_SECRET,
);
