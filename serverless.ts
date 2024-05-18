import type { AWS } from "@serverless/typescript";
import { config } from "dotenv";
import generateCognitoCode from "@functions/cognito/generateCognitoCode";
config({
  path: __dirname + "/.env",
});
const serverlessConfiguration: AWS = {
  service: "auth-moview-api",
  useDotenv: true,
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-offline"],
  provider: {
    name: "aws",
    stage: process.env.STAGE,
    runtime: "nodejs16.x",
    deploymentMethod: "direct",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      STAGE: process.env.STAGE,
      ACCOUNT_ID: process.env.ACCOUNT_ID,
      USER_POOL_ID: process.env.USER_POOL_ID,
      AWS_API_GATEWAY_COGNITO_NAME: process.env.AWS_API_GATEWAY_COGNITO_NAME,
      COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET,
      COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
      COGNITO_DOMAIN: process.env.COGNITO_DOMAIN,
      COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
      COGNITO_LOGOUT_URI: process.env.COGNITO_LOGOUT_URI,
    },
  },
  // import the function via paths
  functions: { generateCognitoCode },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
