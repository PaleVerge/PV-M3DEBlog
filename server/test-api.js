const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  console.log('Testing M3DEBlog API...\n');

  try {
    // Test health check
    console.log('1. Testing health check...');
    const health = await makeRequest('/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data)}\n`);

    // Test get messages
    console.log('2. Testing get messages...');
    const messages = await makeRequest('/api/messages');
    console.log(`   Status: ${messages.status}`);
    console.log(`   Messages count: ${Array.isArray(messages.data) ? messages.data.length : 'N/A'}\n`);

    // Test add message
    console.log('3. Testing add message...');
    const newMessage = {
      nickname: 'Test User',
      content: 'This is a test message'
    };
    const addResult = await makeRequest('/api/messages', 'POST', newMessage);
    console.log(`   Status: ${addResult.status}`);
    console.log(`   Added message ID: ${addResult.data.id}\n`);

    // Test get article likes
    console.log('4. Testing get article likes...');
    const likes = await makeRequest('/api/articles/test-article/likes');
    console.log(`   Status: ${likes.status}`);
    console.log(`   Likes: ${JSON.stringify(likes.data)}\n`);

    // Test admin login
    console.log('5. Testing admin login...');
    const loginResult = await makeRequest('/api/admin/login', 'POST', { password: 'm3de2025' });
    console.log(`   Status: ${loginResult.status}`);
    console.log(`   Login success: ${loginResult.data.success}`);
    console.log(`   Session ID: ${loginResult.data.sessionId ? 'Present' : 'Missing'}\n`);

    console.log('API tests completed successfully!');
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();