// Test Mux connection
require('dotenv').config({ path: '.env.local' });
const Mux = require('@mux/mux-node');

const mux = new Mux(
  process.env.MUX_TOKEN_ID,
  process.env.MUX_TOKEN_SECRET
);

async function test() {
  try {
    console.log('Testing Mux connection...\n');
    console.log('Token ID:', process.env.MUX_TOKEN_ID ? '✅ Set' : '❌ Missing');
    console.log('Token Secret:', process.env.MUX_TOKEN_SECRET ? '✅ Set' : '❌ Missing');
    console.log('\nAttempting to list live streams...\n');
    
    const streams = await mux.video.liveStreams.list({ limit: 1 });
    console.log('✅ Connection successful!');
    console.log('Found', streams.data.length, 'stream(s)\n');
    
    if (streams.data.length > 0) {
      const stream = streams.data[0];
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('EXISTING STREAM FOUND:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Server: rtmp://global-live.mux.com:5222/app');
      console.log('Stream Key:', stream.stream_key);
      console.log('Stream ID:', stream.id);
      console.log('Status:', stream.status);
      console.log('\n');
    } else {
      console.log('No existing streams. Creating new one...\n');
      const newStream = await mux.video.liveStreams.create({
        playback_policy: [{ type: "public" }],
      });
      
      console.log('✅ Stream created!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('OBS SETTINGS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('Server: rtmp://global-live.mux.com:5222/app');
      console.log('Stream Key:', newStream.stream_key);
      console.log('\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    console.error('\nFull error:', error);
  }
}

test();



