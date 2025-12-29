import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// Initialize Mux client only if credentials are available
function getMuxClient() {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;

  if (!tokenId || !tokenSecret) {
    throw new Error("Mux credentials not configured. Please set MUX_TOKEN_ID and MUX_TOKEN_SECRET in your environment variables.");
  }

  return new Mux({
    tokenId,
    tokenSecret,
  });
}

export async function GET(request: NextRequest) {
  try {
    const mux = getMuxClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const liveStreams = await mux.video.liveStreams.list({
      limit,
      page,
    });

    return NextResponse.json({
      success: true,
      liveStreams: liveStreams.data.map((stream) => ({
        id: stream.id,
        streamKey: stream.stream_key,
        status: stream.status,
        playbackIds: stream.playback_ids,
        activeAssetId: stream.active_asset_id,
        createdAt: stream.created_at,
      })),
      pagination: {
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error listing live streams:", error);
    
    // Check for authentication errors
    if (error.message?.includes("credentials not configured") || 
        error.message?.includes("tokenId and tokenSecret") ||
        error.message?.includes("authentication method")) {
      return NextResponse.json(
        {
          success: false,
          error: "Mux credentials not configured. Please set MUX_TOKEN_ID and MUX_TOKEN_SECRET in your environment variables.",
          help: "For local development, add these to .env.local. For production (Vercel), add them in Project Settings → Environment Variables.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to list live streams",
        details: process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}

