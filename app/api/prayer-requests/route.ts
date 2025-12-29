import { NextResponse } from "next/server";
import { PrayerRequest } from "@/lib/types";

// This is a placeholder API route for prayer requests
// In production, save to database and notify prayer team

export async function POST(request: Request) {
  try {
    const body: PrayerRequest = await request.json();

    if (!body.request || !body.request.trim()) {
      return NextResponse.json(
        { error: "Prayer request is required" },
        { status: 400 }
      );
    }

    // In production, save to database:
    // const db = await connectToDatabase();
    // await db.prayerRequests.insert({
    //   ...body,
    //   createdAt: new Date(),
    //   status: 'pending',
    // });

    // Send notification to prayer team (email, Slack, etc.)
    // await sendNotification({
    //   type: 'new_prayer_request',
    //   data: body,
    // });

    console.log("Prayer request received:", {
      name: body.isAnonymous ? "Anonymous" : body.name,
      request: body.request.substring(0, 50) + "...",
    });

    return NextResponse.json({
      success: true,
      message: "Prayer request submitted successfully",
    });
  } catch (error) {
    console.error("Prayer request error:", error);
    return NextResponse.json(
      { error: "Failed to submit prayer request" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve prayer requests (admin only)
export async function GET(request: Request) {
  // In production, add authentication/authorization
  // const session = await getServerSession();
  // if (!session || !isAdmin(session.user)) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // const db = await connectToDatabase();
  // const requests = await db.prayerRequests.find().sort({ createdAt: -1 });
  // return NextResponse.json({ requests });

  return NextResponse.json({ message: "API endpoint ready" });
}





