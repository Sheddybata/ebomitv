// Quick script to create a Mux live stream
// Run with: node scripts/create-stream.js

require('dotenv').config({ path: '.env.local' });
const Mux = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

async function createStream() {
  try {
    console.log('Creating live stream...\n');
    
    const liveStream = await mux.video.liveStreams.create({
      playback_policy: [{ type: "public" }],
      reconnect_window: 60,
    });

    console.log('✅ Stream created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('OBS STUDIO SETTINGS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Server (RTMP URL):');
    console.log('rtmp://global-live.mux.com:5222/app\n');
    console.log('Stream Key:');
    console.log(liveStream.stream_key);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('Stream ID:', liveStream.id);
    console.log('Playback ID:', liveStream.playback_ids?.[0]?.id);
    console.log('Status:', liveStream.status);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📺 View your stream at: http://localhost:3000/live');
    console.log('\n');
    
  } catch (error) {
    console.error('❌ Error creating stream:', error.message);
    if (error.messages) {
      console.error('Details:', error.messages);
    }
    process.exit(1);
  }
}

createStream();

