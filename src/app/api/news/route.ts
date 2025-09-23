import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "";
        const topic = searchParams.get("topic"); // optional topic/category
        const isBreaking = searchParams.get("breaking") === "1";
        
        // Check if API key is available
        if (!process.env.GNEWS_API_KEY) {
            return NextResponse.json(
                { error: "GNEWS_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const endpoint = isBreaking ? "https://gnews.io/api/v4/top-headlines" : "https://gnews.io/api/v4/search";
        const baseUrl = new URL(endpoint);
        if (!isBreaking) {
            baseUrl.searchParams.set("q", q);
        }
        baseUrl.searchParams.set("lang", "en");
        baseUrl.searchParams.set("country", "us");
        baseUrl.searchParams.set("max", "10");
        baseUrl.searchParams.set("apikey", process.env.GNEWS_API_KEY);

        // GNews supports topic param: world, nation, business, technology, entertainment, sports, science, health
        if (topic) {
            baseUrl.searchParams.set("topic", topic);
        }

        // Require a query or topic unless requesting breaking headlines
        if (!isBreaking && !q && !topic) {
            return NextResponse.json(
                { error: "Missing query or topic" },
                { status: 400 }
            );
        }

        const res = await fetch(baseUrl.toString());

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