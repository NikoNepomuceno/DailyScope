import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "";
        const topic = searchParams.get("topic"); // optional topic/category
        const isBreaking = searchParams.get("breaking") === "1";
        const page = searchParams.get("page") || "1";
        const fromDate = searchParams.get("fromDate");
        
        // Check if API key is available
        if (!process.env.GNEWS_API_KEY) {
            return NextResponse.json(
                { error: "GNEWS_API_KEY is not configured" },
                { status: 500 }
            );
        }

        // Use search endpoint for all requests to support pagination and date filtering
        const endpoint = "https://gnews.io/api/v4/search";
        const baseUrl = new URL(endpoint);
        
        if (q) {
            baseUrl.searchParams.set("q", q);
        } else if (topic) {
            // Convert topic to search query for better pagination support
            baseUrl.searchParams.set("q", topic);
        } else if (isBreaking) {
            baseUrl.searchParams.set("q", "breaking news");
        }
        
        baseUrl.searchParams.set("lang", "en");
        baseUrl.searchParams.set("country", "us");
        baseUrl.searchParams.set("max", "10");
        baseUrl.searchParams.set("apikey", process.env.GNEWS_API_KEY);
        
        // Add pagination support
        if (page && page !== "1") {
            baseUrl.searchParams.set("page", page);
        }
        
        // Add date filtering for older articles
        if (fromDate) {
            baseUrl.searchParams.set("from", fromDate);
        }

        // Require a query, topic, or breaking flag
        if (!isBreaking && !q && !topic) {
            return NextResponse.json(
                { error: "Missing query, topic, or breaking parameter" },
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