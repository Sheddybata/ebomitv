import { NextResponse } from "next/server";
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

// Simple test endpoint to create a live stream
export async function GET() {
  try {
    const mux = getMuxClient();

    // Create a new live stream
    const liveStream = await mux.video.liveStreams.create({
      playback_policy: ["public"],
      reconnect_window: 60,
    });

    return NextResponse.json({
      success: true,
      message: "Live stream created successfully!",
      liveStream: {
        id: liveStream.id,
        streamKey: liveStream.stream_key,
        status: liveStream.status,
        playbackId: liveStream.playback_ids?.[0]?.id,
        rtmpUrl: "rtmp://global-live.mux.com:5222/app",
        instructions: {
          step1: "Copy the streamKey below",
          step2: "Open OBS Studio",
          step3: "Go to Settings → Stream",
          step4: "Set Service to 'Custom'",
          step5: `Set Server to: rtmp://global-live.mux.com:5222/app`,
          step6: "Paste the streamKey as your Stream Key",
          step7: "Click 'Start Streaming' in OBS",
          step8: "Your stream will appear on /live page",
        },
      },
    });
  } catch (error: any) {
    console.error("Error creating test live stream:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create live stream",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

