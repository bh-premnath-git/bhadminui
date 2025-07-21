import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/utils/request-logger";

export async function POST(request: NextRequest) {
  logRequest(request);
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL;
  const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX;


  if (!apiUrl) {
    console.error("NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL is not set");
    return NextResponse.json(
      { error: "API URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const fullUrl = `${apiUrl}${apiPrefix}bh-user/generate-token/`;
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        realm: "master",
        username: "admin",
        password: "password",
        client_id: "bighammer-admin",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
