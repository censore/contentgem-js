const { ContentGemClient } = require('../src-client');
require('dotenv').config();

// Configuration
const config = {
  apiKey: process.env.CONTENTGEM_API_KEY || '',
  baseUrl: process.env.CONTENTGEM_BASE_URL || 'https://gemcontent.com/api/v1',
  timeout: parseInt(process.env.TEST_TIMEOUT || '30000')
};

// Initialize client
const client = new ContentGemClient(config);

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing Health Check...');
  try {
    const result = await client.healthCheck();
    console.log('✅ Health Check Success:', {
      message: result.data?.message,
      version: result.data?.version,
      user: result.data?.user?.plan,
      limits: result.data?.limits
    });
    return true;
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testGetPublications() {
  console.log('📚 Testing Get Publications...');
  try {
    const result = await client.getPublications(1, 5);
    console.log('✅ Get Publications Success:', {
      total: result.data?.publications?.length || 0,
      pagination: result.data?.pagination,
      userLimits: result.data?.userLimits
    });
    return true;
  } catch (error) {
    console.log('❌ Get Publications Failed:', error.message);
    return false;
  }
}

async function testGetCompanyInfo() {
  console.log('🏢 Testing Get Company Info...');
  try {
    const result = await client.getCompanyInfo();
    console.log('✅ Get Company Info Success:', {
      name: result.data?.name,
      industry: result.data?.industry,
      description: result.data?.description
    });
    return true;
  } catch (error) {
    console.log('❌ Get Company Info Failed:', error.message);
    return false;
  }
}

async function testGetSubscriptionStatus() {
  console.log('💳 Testing Get Subscription Status...');
  try {
    const result = await client.getSubscriptionStatus();
    console.log('✅ Get Subscription Status Success:', {
      planName: result.data?.subscription?.planName,
      postsUsed: result.data?.subscription?.postsUsed,
      postsRemaining: result.data?.subscription?.postsRemaining
    });
    return true;
  } catch (error) {
    console.log('❌ Get Subscription Status Failed:', error.message);
    return false;
  }
}

async function testGetSubscriptionPlans() {
  console.log('📋 Testing Get Subscription Plans...');
  try {
    const result = await client.getSubscriptionPlans();
    console.log('✅ Get Subscription Plans Success:', {
      plansCount: result.data?.length || 0,
      plans: result.data?.map(p => ({ name: p.name, price: p.price, postsPerMonth: p.postsPerMonth }))
    });
    return true;
  } catch (error) {
    console.log('❌ Get Subscription Plans Failed:', error.message);
    return false;
  }
}

async function testGetSubscriptionLimits() {
  console.log('📊 Testing Get Subscription Limits...');
  try {
    const result = await client.getSubscriptionLimits();
    console.log('✅ Get Subscription Limits Success:', {
      rateLimits: result.data?.rateLimits,
      userLimits: result.data?.userLimits
    });
    return true;
  } catch (error) {
    console.log('❌ Get Subscription Limits Failed:', error.message);
    return false;
  }
}

async function testGetStatisticsOverview() {
  console.log('📈 Testing Get Statistics Overview...');
  try {
    const result = await client.getStatisticsOverview();
    console.log('✅ Get Statistics Overview Success:', {
      publications: result.data?.publications,
      images: result.data?.images,
      apiKeys: result.data?.apiKeys
    });
    return true;
  } catch (error) {
    console.log('❌ Get Statistics Overview Failed:', error.message);
    return false;
  }
}

async function testGetImages() {
  console.log('🖼️ Testing Get Images...');
  try {
    const result = await client.getImages(1, 5);
    console.log('✅ Get Images Success:', {
      totalImages: result.data?.images?.length || 0,
      pagination: result.data?.pagination,
      stats: result.data?.stats
    });
    return true;
  } catch (error) {
    console.log('❌ Get Images Failed:', error.message);
    return false;
  }
}

async function testGetPublicationStats() {
  console.log('📊 Testing Get Publication Stats...');
  try {
    const result = await client.getPublicationStats();
    console.log('✅ Get Publication Stats Success:', result.data);
    return true;
  } catch (error) {
    console.log('❌ Get Publication Stats Failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting ContentGem JavaScript Client Tests...');
  console.log(`Base URL: ${config.baseUrl}`);
  console.log(`Timeout: ${config.timeout}ms`);
  console.log('');

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Get Publications', fn: testGetPublications },
    { name: 'Get Company Info', fn: testGetCompanyInfo },
    { name: 'Get Subscription Status', fn: testGetSubscriptionStatus },
    { name: 'Get Subscription Plans', fn: testGetSubscriptionPlans },
    { name: 'Get Subscription Limits', fn: testGetSubscriptionLimits },
    { name: 'Get Statistics Overview', fn: testGetStatisticsOverview },
    { name: 'Get Images', fn: testGetImages },
    { name: 'Get Publication Stats', fn: testGetPublicationStats }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const success = await test.fn();
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📝 Total: ${tests.length}`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! JavaScript client is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests
if (!config.apiKey) {
  console.error('❌ CONTENTGEM_API_KEY environment variable is required!');
  console.error('Please copy env.example to .env and set your API key.');
  process.exit(1);
}

runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});


