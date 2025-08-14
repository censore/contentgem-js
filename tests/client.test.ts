import { ContentGemClient } from '../src/client';
import { CompanyInfo, GenerationRequest, BulkGenerationRequest } from '../src/types';

// Mock fetch
import fetchMock from 'jest-fetch-mock';

describe('ContentGemClient', () => {
  let client: ContentGemClient;
  const mockApiKey = 'cg_test_api_key_123';
  const mockBaseUrl = 'https://api.test.com/v1';

  beforeEach(() => {
    fetchMock.resetMocks();
    client = new ContentGemClient({
      apiKey: mockApiKey,
      baseUrl: mockBaseUrl,
    });
  });

  describe('constructor', () => {
    it('should create client with default config', () => {
      const defaultClient = new ContentGemClient({ apiKey: mockApiKey });
      expect(defaultClient).toBeInstanceOf(ContentGemClient);
    });

    it('should create client with custom config', () => {
      const customClient = new ContentGemClient({
        apiKey: mockApiKey,
        baseUrl: mockBaseUrl,
        timeout: 5000,
      });
      expect(customClient).toBeInstanceOf(ContentGemClient);
    });
  });

  describe('generatePublication', () => {
    it('should generate publication successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'generating',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const request: GenerationRequest = {
        prompt: 'Write about AI in business',
        company_info: {
          name: 'Test Company',
          description: 'Test description',
        },
      };

      const result = await client.generatePublication(request);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/publications/generate`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      );
    });

    it('should handle API errors', async () => {
      const mockError = {
        success: false,
        error: 'INVALID_PROMPT',
        message: 'Prompt is too short',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockError), { status: 400 });

      const request: GenerationRequest = {
        prompt: 'AI',
      };

      const result = await client.generatePublication(request);

      expect(result).toEqual(mockError);
    });

    it('should handle network errors', async () => {
      fetchMock.mockRejectOnce(new Error('Network error'));

      const request: GenerationRequest = {
        prompt: 'Write about AI',
      };

      await expect(client.generatePublication(request)).rejects.toThrow('Request failed: Network error');
    });
  });

  describe('checkGenerationStatus', () => {
    it('should check generation status successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'completed',
          content: 'Generated content here...',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const sessionId = 'sess_456';
      const result = await client.checkGenerationStatus(sessionId);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/publications/generation-status/${sessionId}`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('getPublications', () => {
    it('should get publications with pagination', async () => {
      const mockResponse = {
        success: true,
        data: {
          publications: [
            {
              id: 'pub_1',
              title: 'Test Publication',
              content: 'Test content',
              type: 'blog',
              status: 'published',
              contentLength: 100,
              imagesCount: 0,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 1,
            itemsPerPage: 10,
          },
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await client.getPublications(1, 10);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/publications?page=1&limit=10`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('waitForGeneration', () => {
    it('should wait for generation to complete', async () => {
      const generatingResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'generating',
        },
      };

      const completedResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'completed',
          content: 'Generated content here...',
        },
      };

      fetchMock
        .mockResponseOnce(JSON.stringify(generatingResponse))
        .mockResponseOnce(JSON.stringify(completedResponse));

      const sessionId = 'sess_456';
      const result = await client.waitForGeneration(sessionId, 2, 100);

      expect(result).toEqual(completedResponse);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should throw error on generation failure', async () => {
      const failedResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'failed',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(failedResponse));

      const sessionId = 'sess_456';
      await expect(client.waitForGeneration(sessionId, 1, 100)).rejects.toThrow('Generation failed');
    });

    it('should throw error on timeout', async () => {
      const generatingResponse = {
        success: true,
        data: {
          publicationId: 'pub_123',
          sessionId: 'sess_456',
          status: 'generating',
        },
      };

      fetchMock.mockResponse(JSON.stringify(generatingResponse));

      const sessionId = 'sess_456';
      await expect(client.waitForGeneration(sessionId, 1, 100)).rejects.toThrow('Generation timeout');
    });
  });

  describe('uploadImage', () => {
    it('should upload image successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          image: {
            id: 'img_123',
            filename: 'test.jpg',
            originalName: 'test.jpg',
            mimeType: 'image/jpeg',
            size: 1024,
            url: 'https://example.com/test.jpg',
            createdAt: '2024-01-01T00:00:00Z',
          },
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const result = await client.uploadImage(file);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/images/upload`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': mockApiKey,
          },
        })
      );
    });
  });

  describe('getSubscriptionStatus', () => {
    it('should get subscription status successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          subscription: {
            planName: 'Pro',
            planSlug: 'pro',
            price: 29.99,
            currency: 'USD',
            interval: 'month',
            postsPerMonth: 100,
            postsUsed: 25,
            postsRemaining: 75,
            status: 'active',
            currentPeriodStart: '2024-01-01T00:00:00Z',
            currentPeriodEnd: '2024-02-01T00:00:00Z',
            cancelAtPeriodEnd: false,
            features: [],
          },
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await client.getSubscriptionStatus();

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/subscription/status`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('bulkGeneratePublications', () => {
    it('should bulk generate publications successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          bulk_session_id: 'bulk_sess_123',
          total_prompts: 3,
          status: 'processing',
          publications: [
            { id: 'pub_1', prompt: 'Write about AI', status: 'pending' },
            { id: 'pub_2', prompt: 'Explain ML', status: 'pending' },
            { id: 'pub_3', prompt: 'Discuss automation', status: 'pending' },
          ],
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const request: BulkGenerationRequest = {
        prompts: [
          'Write about AI in business',
          'Explain machine learning basics',
          'Discuss the future of automation',
        ],
        company_info: {
          name: 'Test Company',
          description: 'Test description',
        },
        common_settings: {
          length: 'medium',
          style: 'educational',
        },
      };

      const result = await client.bulkGeneratePublications(request);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/publications/bulk-generate`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        })
      );
    });

    it('should handle bulk generation errors', async () => {
      const mockError = {
        success: false,
        error: 'INVALID_PROMPTS',
        message: 'Prompts array is empty',
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockError), { status: 400 });

      const request: BulkGenerationRequest = {
        prompts: [],
      };

      const result = await client.bulkGeneratePublications(request);

      expect(result).toEqual(mockError);
    });
  });

  describe('checkBulkGenerationStatus', () => {
    it('should check bulk generation status successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          bulk_session_id: 'bulk_sess_123',
          total_prompts: 3,
          completed_prompts: 2,
          failed_prompts: 0,
          status: 'processing',
          publications: [
            { id: 'pub_1', title: 'AI Article', prompt: 'Write about AI', status: 'completed', content: 'Generated content...' },
            { id: 'pub_2', title: 'ML Article', prompt: 'Explain ML', status: 'completed', content: 'Generated content...' },
            { id: 'pub_3', title: 'Automation Article', prompt: 'Discuss automation', status: 'generating' },
          ],
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const bulkSessionId = 'bulk_sess_123';
      const result = await client.checkBulkGenerationStatus(bulkSessionId);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/publications/bulk-status`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bulk_session_id: bulkSessionId }),
        })
      );
    });
  });

  describe('waitForBulkGeneration', () => {
    it('should wait for bulk generation to complete', async () => {
      const processingResponse = {
        success: true,
        data: {
          bulk_session_id: 'bulk_sess_123',
          status: 'processing',
        },
      };

      const completedResponse = {
        success: true,
        data: {
          bulk_session_id: 'bulk_sess_123',
          status: 'completed',
        },
      };

      fetchMock
        .mockResponseOnce(JSON.stringify(processingResponse))
        .mockResponseOnce(JSON.stringify(completedResponse));

      const bulkSessionId = 'bulk_sess_123';
      const result = await client.waitForBulkGeneration(bulkSessionId, 2, 100);

      expect(result).toEqual(completedResponse);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('should throw error on bulk generation failure', async () => {
      const failedResponse = {
        success: true,
        data: {
          bulk_session_id: 'bulk_sess_123',
          status: 'failed',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(failedResponse));

      const bulkSessionId = 'bulk_sess_123';
      await expect(client.waitForBulkGeneration(bulkSessionId, 1, 100)).rejects.toThrow('Bulk generation failed');
    });
  });

  describe('getCompanyInfo', () => {
    it('should get company information successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          company: {
            name: 'Test Company',
            description: 'Test company description',
            industry: 'Technology',
            website: 'https://testcompany.com',
            contact_email: 'contact@testcompany.com',
            target_audience: 'Developers',
          },
          last_updated: '2024-01-01T00:00:00Z',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await client.getCompanyInfo();

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/company`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  describe('updateCompanyInfo', () => {
    it('should update company information successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          company: {
            name: 'Updated Company',
            description: 'Updated description',
            industry: 'Technology',
            website: 'https://updatedcompany.com',
          },
          last_updated: '2024-01-01T00:00:00Z',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const companyData = {
        name: 'Updated Company',
        description: 'Updated description',
        website: 'https://updatedcompany.com',
      };

      const result = await client.updateCompanyInfo(companyData);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/company`,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(companyData),
        })
      );
    });
  });

  describe('parseCompanyWebsite', () => {
    it('should parse company website successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          parsing_session_id: 'parse_sess_123',
          status: 'processing',
          message: 'Parsing started',
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const websiteUrl = 'https://example.com';
      const result = await client.parseCompanyWebsite(websiteUrl);

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/company/parse`,
        expect.objectContaining({
          method: 'POST',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ website_url: websiteUrl }),
        })
      );
    });
  });

  describe('getCompanyParsingStatus', () => {
    it('should get company parsing status successfully', async () => {
      const mockResponse = {
        success: true,
        data: {
          parsing_session_id: 'parse_sess_123',
          status: 'completed',
          progress: 100,
          extracted_data: {
            name: 'Example Company',
            description: 'Company description from website',
            website: 'https://example.com',
          },
        },
      };

      fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

      const result = await client.getCompanyParsingStatus();

      expect(result).toEqual(mockResponse);
      expect(fetchMock).toHaveBeenCalledWith(
        `${mockBaseUrl}/company/parsing-status`,
        expect.objectContaining({
          method: 'GET',
          headers: {
            'X-API-Key': mockApiKey,
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });
}); 