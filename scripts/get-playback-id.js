// Get playback ID from Mux live stream
require('dotenv').config({ path: '.env.local' });
const Mux = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

async function getLiveStreams() {
  try {
    console.log('Getting live streams...\n');

    const streams = await mux.video.liveStreams.list({ limit: 10 });

    if (streams.data.length === 0) {
      console.log('❌ No live streams found. Please create one in the Mux dashboard first.');
      console.log('Go to: https://dashboard.mux.com/live-streams');
      return;
    }

    console.log('📺 Found', streams.data.length, 'live stream(s):\n');

    streams.data.forEach((stream, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Stream ${index + 1}:`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Stream ID: ${stream.id}`);
      console.log(`Stream Key: ${stream.stream_key}`);
      console.log(`Status: ${stream.status}`);
      console.log(`Playback ID: ${stream.playback_ids?.[0]?.id || 'Not available'}`);
      console.log(`Created: ${stream.created_at}`);
      console.log('');
    });

    // If there's an active stream, show the player URL
    const activeStream = streams.data.find(s => s.status === 'active');
    if (activeStream) {
      console.log('🎬 ACTIVE STREAM DETECTED!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('To view your live stream, visit:');
      console.log('http://localhost:3000/live');
      console.log('');
      console.log('Player will automatically detect and show your live stream.');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

getLiveStreams();



