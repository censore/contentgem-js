import { ContentGemClient } from '../src-client';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

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
  console.log(chalk.blue('🔍 Testing Health Check...'));
  try {
    const result = await client.healthCheck();
    console.log(chalk.green('✅ Health Check Success:'), result);
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Health Check Failed:'), error);
    return false;
  }
}

async function testGetPublications() {
  console.log(chalk.blue('📚 Testing Get Publications...'));
  try {
    const result = await client.getPublications(1, 5);
    console.log(chalk.green('✅ Get Publications Success:'), {
      total: result.data?.publications?.length || 0,
      pagination: result.data?.pagination,
      userLimits: result.data?.userLimits
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Publications Failed:'), error);
    return false;
  }
}

async function testGetCompanyInfo() {
  console.log(chalk.blue('🏢 Testing Get Company Info...'));
  try {
    const result = await client.getCompanyInfo();
    console.log(chalk.green('✅ Get Company Info Success:'), result.data);
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Company Info Failed:'), error);
    return false;
  }
}

async function testGetSubscriptionStatus() {
  console.log(chalk.blue('💳 Testing Get Subscription Status...'));
  try {
    const result = await client.getSubscriptionStatus();
    console.log(chalk.green('✅ Get Subscription Status Success:'), {
      planName: result.data?.subscription?.planName,
      postsUsed: result.data?.subscription?.postsUsed,
      postsRemaining: result.data?.subscription?.postsRemaining
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Subscription Status Failed:'), error);
    return false;
  }
}

async function testGetSubscriptionPlans() {
  console.log(chalk.blue('📋 Testing Get Subscription Plans...'));
  try {
    const result = await client.getSubscriptionPlans();
    console.log(chalk.green('✅ Get Subscription Plans Success:'), {
      plansCount: result.data?.length || 0,
      plans: result.data?.map(p => ({ name: p.name, price: p.price, postsPerMonth: p.postsPerMonth }))
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Subscription Plans Failed:'), error);
    return false;
  }
}

async function testGetSubscriptionLimits() {
  console.log(chalk.blue('📊 Testing Get Subscription Limits...'));
  try {
    const result = await client.getSubscriptionLimits();
    console.log(chalk.green('✅ Get Subscription Limits Success:'), {
      rateLimits: result.data?.rateLimits,
      userLimits: result.data?.userLimits
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Subscription Limits Failed:'), error);
    return false;
  }
}

async function testGetStatisticsOverview() {
  console.log(chalk.blue('📈 Testing Get Statistics Overview...'));
  try {
    const result = await client.getStatisticsOverview();
    console.log(chalk.green('✅ Get Statistics Overview Success:'), {
      publications: result.data?.publications,
      images: result.data?.images,
      apiKeys: result.data?.apiKeys
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Statistics Overview Failed:'), error);
    return false;
  }
}

async function testGetImages() {
  console.log(chalk.blue('🖼️ Testing Get Images...'));
  try {
    const result = await client.getImages(1, 5);
    console.log(chalk.green('✅ Get Images Success:'), {
      totalImages: result.data?.images?.length || 0,
      pagination: result.data?.pagination,
      stats: result.data?.stats
    });
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Images Failed:'), error);
    return false;
  }
}

async function testGetPublicationStats() {
  console.log(chalk.blue('📊 Testing Get Publication Stats...'));
  try {
    const result = await client.getPublicationStats();
    console.log(chalk.green('✅ Get Publication Stats Success:'), result.data);
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Get Publication Stats Failed:'), error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(chalk.yellow('🚀 Starting ContentGem JavaScript Client Tests...'));
  console.log(chalk.gray(`Base URL: ${config.baseUrl}`));
  console.log(chalk.gray(`Timeout: ${config.timeout}ms`));
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
    console.log(chalk.cyan(`\n--- ${test.name} ---`));
    const success = await test.fn();
    if (success) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log(chalk.yellow('\n📊 Test Results:'));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  console.log(chalk.blue(`📝 Total: ${tests.length}`));

  if (failed === 0) {
    console.log(chalk.green('\n🎉 All tests passed! JavaScript client is working correctly.'));
  } else {
    console.log(chalk.red('\n⚠️ Some tests failed. Please check the errors above.'));
  }
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

// Run tests
if (require.main === module) {
  if (!config.apiKey) {
    console.error(chalk.red('❌ CONTENTGEM_API_KEY environment variable is required!'));
    console.error(chalk.yellow('Please copy env.example to .env and set your API key.'));
    process.exit(1);
  }

  runTests().catch(error => {
    console.error(chalk.red('❌ Test runner failed:'), error);
    process.exit(1);
  });
}

export { runTests, client };
