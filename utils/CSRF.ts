import csrf from "csrf";
import { verify } from "jsonwebtoken";

const csrfInstance = new csrf();
const jwtSecret = process.env.SECURITY_JWT_SECRET;
const csrfSecret = process.env.SECURITY_CSRF_SECRET;

export function verifyCsrfJwt(jwt: string) {
  const tokenJWT = verify(jwt, jwtSecret);
  return tokenJWT;
}

/**
 * Validates the CSRF token against the stored secret in the cookie.
 */
export function validateCsrfToken(csrfJwt: string, url: string) {
  const response = { status: 200, error: "" };

  const csrfDecoded = verifyCsrfJwt(csrfJwt);
  let csrfToken = "";
  if (typeof csrfDecoded !== "string") {
    if (csrfDecoded.aud !== url) {
      console.log("Invalid Audience:", csrfDecoded.aud, url);
    } else {
      csrfToken = csrfDecoded.value;
    }
  }

  let isValid = false;
  try {
    if (csrfToken) {
      isValid = csrfInstance.verify(csrfSecret, csrfToken);
    }

    if (isValid) {
      console.log("CSRF Token is valid.");
    } else {
      // TODO Logout and redirect to login page
      response.status = 401;
      response.error = "Invalid CSRF Token";
      console.log("Invalid CSRF Token");
    }
  } catch (error) {
    console.log("Verification Error:", error);
  }

  return response;
}
