import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions";

export const GET = async () => {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: "/",
        apiPath: "/api/action/",
      },
      // fallback route
      {
        pathPattern: "/api/action/",
        apiPath: "/api/action/",
      }
    ],
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  });
};
// ensures cors
export const OPTIONS = GET;