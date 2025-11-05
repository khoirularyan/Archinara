#!/usr/bin/env node

/**
 * Dashboard Performance Testing Script
 * 
 * Tests the /api/pm/dashboard endpoint performance
 * Measures TTFB, total time, and validates response structure
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const NUM_REQUESTS = 5;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function makeRequest(url, cookie) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const startTime = Date.now();
    let ttfb = 0;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      headers: cookie ? { 'Cookie': cookie } : {},
    };
    
    const req = client.request(options, (res) => {
      ttfb = Date.now() - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const totalTime = Date.now() - startTime;
        
        try {
          const json = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            ttfb,
            totalTime,
            data: json,
            headers: res.headers,
          });
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testDashboardEndpoint() {
  console.log(`${colors.cyan}🧪 Dashboard Performance Test${colors.reset}`);
  console.log(`${colors.cyan}==============================${colors.reset}\n`);
  
  console.log(`📍 Target: ${BASE_URL}/api/pm/dashboard`);
  console.log(`🔢 Requests: ${NUM_REQUESTS}\n`);
  
  const results = [];
  
  for (let i = 1; i <= NUM_REQUESTS; i++) {
    process.stdout.write(`Request ${i}/${NUM_REQUESTS}... `);
    
    try {
      const result = await makeRequest(`${BASE_URL}/api/pm/dashboard`);
      results.push(result);
      
      const status = result.statusCode === 200 
        ? `${colors.green}✅ ${result.statusCode}${colors.reset}`
        : `${colors.red}❌ ${result.statusCode}${colors.reset}`;
      
      const ttfbColor = result.ttfb < 500 ? colors.green : result.ttfb < 1000 ? colors.yellow : colors.red;
      const totalColor = result.totalTime < 2000 ? colors.green : result.totalTime < 5000 ? colors.yellow : colors.red;
      
      console.log(
        `${status} | TTFB: ${ttfbColor}${result.ttfb}ms${colors.reset} | Total: ${totalColor}${result.totalTime}ms${colors.reset}`
      );
      
      // Validate response structure
      if (i === 1) {
        console.log(`\n${colors.blue}📦 Response Structure:${colors.reset}`);
        const data = result.data;
        
        if (data.stats) {
          console.log(`  ✅ stats: {`);
          console.log(`      projects: ${data.stats.projects}`);
          console.log(`      team: ${data.stats.team}`);
          console.log(`      tasks: ${data.stats.tasks}`);
          console.log(`      activeProjects: ${data.stats.activeProjects}`);
          console.log(`      pendingTasks: ${data.stats.pendingTasks}`);
          console.log(`      completedTasksThisMonth: ${data.stats.completedTasksThisMonth}`);
          console.log(`    }`);
        } else {
          console.log(`  ❌ stats: missing`);
        }
        
        if (data.recentProjects) {
          console.log(`  ✅ recentProjects: ${data.recentProjects.length} items`);
        } else {
          console.log(`  ❌ recentProjects: missing`);
        }
        
        if (data.notifications !== undefined) {
          console.log(`  ✅ notifications: ${data.notifications.length} items`);
        } else {
          console.log(`  ⚠️  notifications: missing (optional)`);
        }
        
        if (data.timestamp) {
          console.log(`  ✅ timestamp: ${data.timestamp}`);
        }
        
        // Check cache headers
        const cacheControl = result.headers['cache-control'];
        if (cacheControl) {
          console.log(`\n${colors.blue}💾 Cache Headers:${colors.reset}`);
          console.log(`  Cache-Control: ${cacheControl}`);
        }
        
        console.log('');
      }
      
      // Wait a bit between requests
      if (i < NUM_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
      results.push({ error: error.message });
    }
  }
  
  // Calculate statistics
  console.log(`\n${colors.cyan}📊 Performance Statistics${colors.reset}`);
  console.log(`${colors.cyan}=========================${colors.reset}\n`);
  
  const successfulResults = results.filter(r => !r.error && r.statusCode === 200);
  
  if (successfulResults.length === 0) {
    console.log(`${colors.red}❌ No successful requests${colors.reset}`);
    return;
  }
  
  const ttfbs = successfulResults.map(r => r.ttfb);
  const totalTimes = successfulResults.map(r => r.totalTime);
  
  const avgTtfb = Math.round(ttfbs.reduce((a, b) => a + b, 0) / ttfbs.length);
  const minTtfb = Math.min(...ttfbs);
  const maxTtfb = Math.max(...ttfbs);
  
  const avgTotal = Math.round(totalTimes.reduce((a, b) => a + b, 0) / totalTimes.length);
  const minTotal = Math.min(...totalTimes);
  const maxTotal = Math.max(...totalTimes);
  
  console.log(`TTFB (Time to First Byte):`);
  console.log(`  Average: ${avgTtfb < 500 ? colors.green : colors.yellow}${avgTtfb}ms${colors.reset}`);
  console.log(`  Min: ${minTtfb}ms`);
  console.log(`  Max: ${maxTtfb}ms\n`);
  
  console.log(`Total Time:`);
  console.log(`  Average: ${avgTotal < 2000 ? colors.green : colors.yellow}${avgTotal}ms${colors.reset}`);
  console.log(`  Min: ${minTotal}ms`);
  console.log(`  Max: ${maxTotal}ms\n`);
  
  // Performance verdict
  console.log(`${colors.cyan}🎯 Performance Verdict${colors.reset}`);
  console.log(`${colors.cyan}=====================${colors.reset}\n`);
  
  const checks = [
    { name: 'TTFB < 500ms', pass: avgTtfb < 500, target: '< 500ms', actual: `${avgTtfb}ms` },
    { name: 'Total Time < 2s', pass: avgTotal < 2000, target: '< 2000ms', actual: `${avgTotal}ms` },
    { name: 'Success Rate 100%', pass: successfulResults.length === NUM_REQUESTS, target: '100%', actual: `${Math.round(successfulResults.length / NUM_REQUESTS * 100)}%` },
  ];
  
  checks.forEach(check => {
    const icon = check.pass ? `${colors.green}✅` : `${colors.red}❌`;
    console.log(`${icon} ${check.name}${colors.reset}`);
    console.log(`   Target: ${check.target} | Actual: ${check.actual}\n`);
  });
  
  const allPassed = checks.every(c => c.pass);
  
  if (allPassed) {
    console.log(`${colors.green}🎉 All performance targets met!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠️  Some performance targets not met. Consider further optimization.${colors.reset}\n`);
  }
}

// Run the test
testDashboardEndpoint().catch(console.error);
