import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "technology";
        
        // Check if API key is available
        if (!process.env.GNEWS_API_KEY) {
            return NextResponse.json(
                { error: "GNEWS_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const res = await fetch(
            `https://gnews.io/api/v4/search?q=${q}&lang=en&country=us&max=10&apikey=${process.env.GNEWS_API_KEY}`
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: `Failed to fetch news: ${res.status} ${res.statusText}` },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("News API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}