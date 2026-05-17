const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = '/tmp/next-persistent.log';

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, line);
  console.log(line.trim());
}

function startServer() {
  log('Starting Next.js server...');
  
  const env = {
    ...process.env,
    DATABASE_URL: 'postgresql://neondb_owner:npg_omga5szZAf4l@ep-shiny-paper-aousfq8l-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  };
  
  const child = spawn('node', ['node_modules/.bin/next', 'dev', '--port', '3000', '-H', '0.0.0.0'], {
    cwd: '/home/z/my-project',
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: false
  });

  child.stdout.on('data', (data) => {
    fs.appendFileSync(logFile, data.toString());
  });

  child.stderr.on('data', (data) => {
    fs.appendFileSync(logFile, data.toString());
  });

  child.on('exit', (code, signal) => {
    log(`Server exited with code ${code}, signal ${signal}`);
    // Restart after a delay
    setTimeout(startServer, 3000);
  });

  child.on('error', (err) => {
    log(`Server error: ${err.message}`);
    setTimeout(startServer, 3000);
  });

  log(`Server PID: ${child.pid}`);
}

startServer();

// Keep the process alive
setInterval(() => {
  log('Heartbeat - process still running');
}, 30000);
