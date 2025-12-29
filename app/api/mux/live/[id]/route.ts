import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

// GET - Get live stream status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const liveStream = await mux.video.liveStreams.retrieve(id);

    return NextResponse.json({
      success: true,
      liveStream: {
        id: liveStream.id,
        streamKey: liveStream.stream_key,
        status: liveStream.status,
        playbackIds: liveStream.playback_ids,
        activeAssetId: liveStream.active_asset_id,
        createdAt: liveStream.created_at,
      },
    });
  } catch (error: any) {
    console.error("Error fetching live stream:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch live stream",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete live stream
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await mux.video.liveStreams.delete(id);

    return NextResponse.json({
      success: true,
      message: "Live stream deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting live stream:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete live stream",
      },
      { status: 500 }
    );
  }
}

