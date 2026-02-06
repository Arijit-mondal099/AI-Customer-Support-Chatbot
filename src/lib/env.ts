// environment veriable configuration
export const ENV = {
  API_URI: process.env.NEXT_PUBLIC_API_URI! as string,
  SCALEKIT_ENVIRONMENT_URL: process.env.SCALEKIT_ENVIRONMENT_URL! as string,
  SCALEKIT_CLIENT_ID: process.env.SCALEKIT_CLIENT_ID! as string,
  SCALEKIT_CLIENT_SECRET: process.env.SCALEKIT_CLIENT_SECRET! as string,
  MONGODB_URI: process.env.MONGODB_URI! as string,
};
