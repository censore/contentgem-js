console.log('🚀 ContentGem JavaScript Client Test Project');
console.log('✅ Container is running successfully!');
console.log('📁 Current directory:', process.cwd());
console.log('📋 Environment variables:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - CONTENTGEM_API_KEY:', process.env.CONTENTGEM_API_KEY ? '***SET***' : 'NOT SET');
console.log('  - CONTENTGEM_BASE_URL:', process.env.CONTENTGEM_BASE_URL || 'NOT SET');

// List files in current directory
const fs = require('fs');
console.log('\n📁 Files in current directory:');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stats = fs.statSync(file);
    const type = stats.isDirectory() ? '📁' : '📄';
    console.log(`  ${type} ${file}`);
  });
} catch (error) {
  console.log('❌ Error reading directory:', error.message);
}

console.log('\n🎉 Simple test completed successfully!');
console.log('💡 To run actual tests, set CONTENTGEM_API_KEY in .env file');
