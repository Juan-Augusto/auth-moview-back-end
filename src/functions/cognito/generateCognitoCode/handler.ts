import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { decode } from "jsonwebtoken";
import { middyfy } from "@libs/lambda";
import axios from "axios";

import schema from "./schema";

const generateCognitoCode: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async ({ body: { code } }) => {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const redirectUri = process.env.COGNITO_REDIRECT_URI;
  const cognitoDomain = process.env.COGNITO_DOMAIN;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const tokenEndpoint = `${cognitoDomain}/oauth2/token`;

  const requestBody = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code: code,
  });
  console.log("Request body", requestBody.toString());
  try {
    const response = await axios.post(tokenEndpoint, requestBody.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const jwtToken = response.data.id_token;
    const decodedToken = decode(jwtToken);
    return formatJSONResponse({
      decodedToken,
      jwtToken,
    });
  } catch (error) {
    console.error(error.response.data);
    throw new Error("Failed to exchange authorization code for JWT token");
  }
};

export const main = middyfy(generateCognitoCode);
