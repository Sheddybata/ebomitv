import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// Initialize Mux client
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function POST(request: NextRequest) {
  try {
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

