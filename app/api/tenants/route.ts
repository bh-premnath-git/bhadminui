import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"
const apiUrl = process.env.NEXT_PUBLIC_KEYCLOAK_API_REMOTE_URL
const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX

export async function GET(request: NextRequest) {
   
    const authorization = request.headers.get("authorization")
   
    if (!authorization) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }    

    if (!apiUrl) {
        console.log("ERROR: API URL is not configured")
        return NextResponse.json({ error: "API URL is not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const backendUrl = new URL(`${apiUrl}${apiPrefix}bh-tenant/list/`)
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

        const response = await fetch(`${apiUrl}${apiPrefix}bh-tenant`, {
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
