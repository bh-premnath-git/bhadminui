import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const authorization = request.headers.get("authorization")
    console.log("Authorization:", authorization)
    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_KEYCLOAK_API_REMOTE_URL
    if (!apiUrl) {
        return NextResponse.json({ error: "API URL is not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const backendUrl = new URL(`${apiUrl}/bh-tenant/list/`)
    backendUrl.search = searchParams.toString()

    try {
        const response = await fetch(backendUrl.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("List tenants error:", error)
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const authorization = request.headers.get("authorization")

    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiUrl = process.env.NEXT_KEYCLOAK_API_REMOTE_URL

    if (!apiUrl) {
        return NextResponse.json({ error: "API URL is not configured" }, { status: 500 })
    }

    try {
        const body = await request.json()

        // Transform bh_tags to the format expected by the backend
        const { bh_tags, ...rest } = body
        const payload = {
            ...rest,
            bh_tags: { data: bh_tags },
        }

        const response = await fetch(`${apiUrl}/bh-tenant/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
            body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: data }, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Tenant creation error:", error)
        return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 })
    }
}
