import Axios from "axios";

/**
 * Calls api/callOut to send external requests to the API
 
 * - `method`: HTTP method to use ("GET", "POST", "PUT", "DELETE").
 
 * - `resource`: The resource you wish to access from the API.
    Example: "product" --> resolves to repere.phpreaction.com/product.
    
 * - `parameters`: (Optional) A list of query parameters.
    Example: { sku: 123456789 } --> resolves to repere.phpreaction.com/product?sku=123456789.
 
 * - `payload`: (Optional) The request body, only used for POST/PUT requests.
 */

const axiosInstance = Axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default async function CallAPI(
  method: "GET" | "POST" | "PUT" | "DELETE",
  resource: string,
  parameters?: any,
  payload?: any,
  logRequest: boolean = true
) {
  /* // Remove csrf and userId from the payload
  let csrfToken: string;
  let userId: string;
  if (payload) {
    const jsonPayload = JSON.parse(payload);
    if (jsonPayload?.csrf) {
      csrfToken = jsonPayload.csrf;
      delete jsonPayload.csrf;
      payload = JSON.stringify(jsonPayload);
    }

    if (jsonPayload?.userId) {
      userId = jsonPayload.userId;
      delete jsonPayload.userId;
      payload = JSON.stringify(jsonPayload);
    }
  } */

  const response = await axiosInstance.request({
    method,
    url: "/api/callOut",
    /* headers: {
      "X-CSRF-TOKEN": csrfToken,
      "X-User-Id": userId,
    }, */
    params: { resource, parameters },
    data: payload,
  });

  if (logRequest) {
    console.log(
      "CallAPI response",
      method,
      resource,
      parameters,
      payload,
      response
    );
  }

  return response;
}

export const CallAPIURL = {
  dishes: {
    get: `dishes`,
    getById: (id: string) => `dishes/${id}`,
  },
  generatePresignedUrl: {
    get: `generatePresignedUrl`
  },
  ratings: {
    get: `ratings`,
    getById: (id: string) => `ratings/${id}`,
  },
  users: {
    get: `users`,
  }
};
