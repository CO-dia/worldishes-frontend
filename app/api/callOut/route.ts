import { authOptions } from "@/libs/next-auth";
import { rateLimitByKey } from "@/utils/RateLimiter";
import Axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Shared Axios instance
const axiosInstance = Axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to construct URL dynamically
function constructUrl(resource: string): string {
  return `${process.env.API_URL}${process.env.API_VERSION}${resource}`;
}

export async function GET(request: NextRequest) {
  let response;

  try {
    const { searchParams } = new URL(request.url);

    const authToken =
      request.cookies.get("next-auth.session-token").value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    const validationData = await securityValidation(request, "GET", 10);
    if (validationData.status !== 200) {
      return new Response(JSON.stringify({ error: validationData.error }), {
        status: validationData.status,
      });
    }

    const values = {
      resource: searchParams.get("resource"),
      parameters: searchParams.get("parameters"),
    };

    if (values.parameters) {
      values.parameters = JSON.parse(values.parameters);
    }

    const url = constructUrl(values.resource);

    const res = await axiosInstance.get(url, {
      params: values.parameters,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    response = new Response(JSON.stringify({ response: res.data }));
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      status: error.response?.status || 500,
    });
  }

  return response;
}

export async function POST(request: NextRequest) {
  const authToken =
    request.cookies.get("next-auth.session-token").value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  if (!authToken) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    });
  }

  let response;

  try {
    const { searchParams } = new URL(request.url);

    const validationData = await securityValidation(request, "POST");
    if (validationData.status !== 200) {
      return NextResponse.json(
        { error: validationData.error },
        { status: validationData.status }
      );
    }

    const values = {
      resource: searchParams.get("resource"),
      parameters: searchParams.get("parameters"),
      payload: await request.json(),
    };

    if (values.parameters) {
      values.parameters = JSON.parse(values.parameters);
    }

    const url = constructUrl(values.resource);

    response = await axiosInstance.post(url, values.payload, {
      params: values.parameters,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      status: error.response?.status || 500,
    });
  }

  return Response.json({ response: response?.data });
}

export async function PUT(request: NextRequest) {
  const authToken =
    request.cookies.get("next-auth.session-token").value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  if (!authToken) {
    return new Response(JSON.stringify({ error: "Unauthorized access" }), {
      status: 401,
    });
  }

  let response;

  try {
    const { searchParams } = new URL(request.url);

    const validationData = await securityValidation(request, "PUT");
    if (validationData.status !== 200) {
      return new Response(JSON.stringify({ error: validationData.error }), {
        status: validationData.status,
      });
    }

    const values = {
      resource: searchParams.get("resource"),
      parameters: searchParams.get("parameters"),
      payload: await request.json(),
    };

    if (values.parameters) {
      values.parameters = JSON.parse(values.parameters);
    }

    const url = constructUrl(values.resource);

    response = await axiosInstance.put(url, values.payload, {
      params: values.parameters,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error }), {
      status: error.response?.status || 500,
    });
  }

  return Response.json({ response: response?.data });
}

/**
 * Function to make security checks before processing the request (CSRF token validation and rate limiting)
 * @param request Request object
 * @param keyPrefix Prefix to uniquely identify the rate limit key eg. GET-key or POST-key because we don't want similar limits for different methods
 * @param limit number of requests allowed in a time frame (10 seconds)
 * @returns { status: number; error: string }
 */
async function securityValidation(
  request: NextRequest,
  keyPrefix: string,
  limit?: number
): Promise<{ status: number; error: string }> {
  let response: { status: number; error: string } = { status: 200, error: "" };
  try {
    /* // Validate CSRF token
    const csrfToken = request.headers.get("x-csrf-token") || "";
    const urlReferer = request.headers.get("referer");
    response = validateCsrfToken(csrfToken, urlReferer || "");
 */
    if (response.status !== 200) {
      return response;
    }

    const ipAddress =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for");
    if (ipAddress)
      response = await rateLimitByKey(`${keyPrefix}-${ipAddress}`, limit);
  } catch (error: any) {
    response = { status: error.response?.status || 500, error: error.message };
  }

  return response;
}
