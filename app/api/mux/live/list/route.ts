import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

export async function GET(request: NextRequest) {
  try {
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
        total: liveStreams.total_count,
        page,
        limit,
      },
    });
  } catch (error: any) {
    console.error("Error listing live streams:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to list live streams",
      },
      { status: 500 }
    );
  }
}

