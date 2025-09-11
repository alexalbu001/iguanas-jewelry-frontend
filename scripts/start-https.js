const https = require('https');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

// Paths to the SSL certificates
const certPath = path.join(__dirname, '..', 'localhost+2.pem');
const keyPath = path.join(__dirname, '..', 'localhost+2-key.pem');

// Check if certificates exist
if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('SSL certificates not found!');
  console.error('Please run: mkcert localhost 127.0.0.1 ::1');
  process.exit(1);
}

// Read the SSL certificates
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

// Set environment variables for HTTPS
process.env.HTTPS = 'true';
process.env.SSL_CRT_FILE = certPath;
process.env.SSL_KEY_FILE = keyPath;

// Start the React development server with HTTPS
const startServer = () => {
  console.log('🚀 Starting React development server with HTTPS...');
  console.log('📜 Using SSL certificates for localhost');
  console.log('🌐 Your app will be available at: https://localhost:3000');
  
  const child = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      HTTPS: 'true',
      SSL_CRT_FILE: certPath,
      SSL_KEY_FILE: keyPath
    }
  });

  child.on('error', (error) => {
    console.error('Failed to start server:', error);
  });

  child.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
};

startServer();
