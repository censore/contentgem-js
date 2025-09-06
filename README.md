# GemContent JavaScript SDK

Official JavaScript/TypeScript SDK for the GemContent API.

## Installation

```bash
npm install gemcontent-js
```

## Quick Start

```javascript
import GemContentClient from 'gemcontent-js';

const client = new GemContentClient({
  apiKey: 'cg_your_api_key_here',
  baseUrl: 'https://your-domain.com/api/v1' // optional
});

// Generate content
const result = await client.generatePublication({
  prompt: 'Write about AI in business',
  company_info: {
    name: 'TechCorp',
    description: 'Leading technology solutions provider'
  }
});

if (result.success) {
  const sessionId = result.data.sessionId;
  
  // Wait for generation to complete
  const status = await client.waitForGeneration(sessionId);
  
  if (status.success) {
    console.log('Generated content:', status.data.content);
  }
}
```

## Features

- ✅ **Full TypeScript support** with complete type definitions
- ✅ **All API endpoints** covered
- ✅ **Error handling** with detailed error messages
- ✅ **Async/await** support
- ✅ **Browser and Node.js** compatible
- ✅ **Automatic retry** and timeout handling
- ✅ **Generation polling** with `waitForGeneration()`
- ✅ **Bulk generation** support for multiple publications
- ✅ **Company management** with website parsing
- ✅ **Real-time status tracking** for all operations

## API Reference

### Constructor

```javascript
new GemContentClient(config)
```

**Config options:**
- `apiKey` (required): Your GemContent API key
- `baseUrl` (optional): API base URL (default: `https://your-domain.com/api/v1`)
- `timeout` (optional): Request timeout in milliseconds (default: 30000)

### Publications

```javascript
// Get all publications
const publications = await client.getPublications(page, limit);

// Get specific publication
const publication = await client.getPublication(id);

// Create publication
const newPub = await client.createPublication(data);

// Generate content
const result = await client.generatePublication({
  prompt: 'Your prompt here',
  company_info: { /* company info */ }
});

// Check generation status
const status = await client.checkGenerationStatus(sessionId);

// Wait for generation to complete
const completed = await client.waitForGeneration(sessionId);

// Update publication
await client.updatePublication(id, data);

// Delete publication
await client.deletePublication(id);

// Publish/Archive
await client.publishPublication(id);
await client.archivePublication(id);

// Download
await client.downloadPublication(id, 'pdf');
```

### Bulk Generation

```javascript
// Bulk generate multiple publications
const bulkResult = await client.bulkGeneratePublications({
  prompts: [
    'Write about AI in business',
    'Explain machine learning basics',
    'Discuss the future of automation'
  ],
  company_info: {
    name: 'TechCorp',
    description: 'Technology company'
  },
  common_settings: {
    length: 'medium',
    style: 'educational'
  }
});

// Check bulk generation status
const bulkStatus = await client.checkBulkGenerationStatus(bulkSessionId);

// Wait for bulk generation to complete
const completedBulk = await client.waitForBulkGeneration(bulkSessionId);
```

### Company Management

```javascript
// Get company information
const companyInfo = await client.getCompanyInfo();

// Update company information
await client.updateCompanyInfo({
  name: 'Updated Company Name',
  description: 'Updated description',
  website: 'https://example.com',
  contact_email: 'contact@example.com'
});

// Parse company website
const parsingResult = await client.parseCompanyWebsite('https://example.com');

// Get parsing status
const parsingStatus = await client.getCompanyParsingStatus();
```

### Images

```javascript
// Get all images
const images = await client.getImages(page, limit);

// Get specific image
const image = await client.getImage(id);

// Upload image
const uploaded = await client.uploadImage(file, publicationId);

// Generate AI image
const generated = await client.generateImage(prompt, style, size);

// Delete image
await client.deleteImage(id);
```

### Subscription & Statistics

```javascript
// Subscription
const status = await client.getSubscriptionStatus();
const limits = await client.getSubscriptionLimits();
const plans = await client.getSubscriptionPlans();

// Statistics
const overview = await client.getStatisticsOverview();
const pubStats = await client.getPublicationStatistics();
const imgStats = await client.getImageStatistics();
```

## Error Handling

```javascript
try {
  const result = await client.generatePublication({
    prompt: 'Test prompt'
  });
  
  if (result.success) {
    console.log('Success:', result.data);
  } else {
    console.error('API Error:', result.error, result.message);
  }
} catch (error) {
  console.error('Network Error:', error.message);
}
```

## Browser Usage

```html
<script type="module">
  import GemContentClient from 'https://unpkg.com/gemcontent-js/dist/index.esm.js';
  
  const client = new GemContentClient({
    apiKey: 'cg_your_api_key_here'
  });
  
  // Use the client...
</script>
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Format code
npm run format
```

## License

MIT License 