import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_KEYCLOAK_API_REMOTE_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "API URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(`${apiUrl}/bh-user/generate-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        realm: "master",
        username: "bighammer-admin",
        password: "password123",
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
