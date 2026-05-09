const { spawn, execSync } = require('child_process');
const qrcode = require('qrcode-terminal');
const ngrok = require('ngrok');

console.log('🚀 Starting CampusKobo Ngrok-Tunnel...');

// Helper to kill process on port 8081
function killPort(port) {
  try {
    if (process.platform === 'win32') {
      execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a`, { stdio: 'ignore' });
    } else {
      execSync(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore' });
    }
  } catch (e) {}
}

async function start() {
  try {
    killPort(8081);

    console.log('🧹 Port 8081 cleared.');
    console.log('📡 Starting Expo server...');
    
    // Start Expo in LAN mode (local server)
    const expo = spawn('npx', ['expo', 'start', '--lan'], { 
      shell: true, 
      stdio: 'inherit' 
    });

    console.log('🌐 Establishing secure Ngrok tunnel...');
    
    // Connect with your token and region
    const url = await ngrok.connect({
      proto: 'http',
      addr: 8081,
      authtoken: '3DB4AqgIGJg0EuusSvHBoSJYRBD_6au9grmCbxKMZqvzUpkuQ',
      region: 'eu'
    });

    // Strip any trailing slashes
    let cleanUrl = url.replace(/\/$/, '');
    
    // Convert to Expo format
    const expoUrl = cleanUrl.replace('https://', 'exp://').replace('http://', 'exp://');

    console.log('\n✅ NGROK CONNECTION SUCCESSFUL!');
    console.log(`🔗 Public URL: ${cleanUrl}`);
    console.log(`📱 Expo URL:   ${expoUrl}`);
    console.log('\nSCAN THIS WITH EXPO GO:');
    
    qrcode.generate(expoUrl, { small: true });

    process.on('SIGINT', () => {
      console.log('\n👋 Closing connections...');
      ngrok.disconnect();
      ngrok.kill();
      expo.kill();
      process.exit();
    });

  } catch (err) {
    console.error('❌ Ngrok failed to connect:', err);
    console.log('Tip: Make sure you don\'t have another ngrok session running elsewhere.');
  }
}

start();
