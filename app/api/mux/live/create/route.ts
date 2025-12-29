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

export async function POST(request: NextRequest) {
  try {
    const mux = getMuxClient();
    const body = await request.json();
    const { playbackPolicy = "public", reconnectWindow = 60 } = body;

    // Create a new live stream
    const liveStream = await mux.video.liveStreams.create({
      playback_policy: playbackPolicy === "public"
        ? ["public"]
        : ["signed"],
      reconnect_window: reconnectWindow,
      new_asset_settings: {
        playback_policy: ["public"],
        mp4_support: "standard",
      },
    });

    return NextResponse.json({
      success: true,
      liveStream: {
        id: liveStream.id,
        streamKey: liveStream.stream_key,
        status: liveStream.status,
        playbackIds: liveStream.playback_ids,
        reconnectWindow: liveStream.reconnect_window,
        createdAt: liveStream.created_at,
      },
    });
  } catch (error: any) {
    console.error("Error creating live stream:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create live stream",
      },
      { status: 500 }
    );
  }
}

