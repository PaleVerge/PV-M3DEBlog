const { spawn, exec } = require('child_process');
const http = require('http');

// 启动服务器
console.log('Starting server...');
const server = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'pipe'
});

server.stdout.on('data', (data) => {
  console.log(`Server: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

// 等待服务器启动
setTimeout(() => {
  console.log('\nRunning API tests...\n');
  
  // 运行测试
  const test = spawn('node', ['simple-test.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  test.on('close', (code) => {
    console.log(`\nTest exited with code ${code}`);
    server.kill();
    process.exit(code);
  });
}, 3000);

// 处理进程退出
process.on('SIGINT', () => {
  server.kill();
  process.exit();
});