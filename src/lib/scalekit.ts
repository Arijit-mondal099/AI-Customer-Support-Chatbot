import { Scalekit } from "@scalekit-sdk/node";
import { ENV } from "./env";

let _scalekit: Scalekit | null = null;

export const getScalekit = (): Scalekit => {
  if (!_scalekit) {
    _scalekit = new Scalekit(
      ENV.SCALEKIT_ENVIRONMENT_URL,
      ENV.SCALEKIT_CLIENT_ID,
      ENV.SCALEKIT_CLIENT_SECRET,
    );
  }
  return _scalekit;
};
