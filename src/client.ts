import fetch, { RequestInit, Response } from 'node-fetch';
import {
  ContentGemConfig,
  GenerationRequest,
  GenerationResponse,
  GenerationStatus,
  PublicationsResponse,
  Publication,
  ImagesResponse,
  Image,
  SubscriptionStatus,
  StatisticsOverview,
  ApiError,
  CompanyInfo,
  BulkGenerationRequest,
  BulkGenerationResponse,
  BulkGenerationStatus,
  CompanyData,
  CompanyResponse,
  CompanyParsingRequest,
  CompanyParsingResponse,
  CompanyParsingStatus
} from './types';

export class ContentGemClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: ContentGemConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://your-domain.com/api/v1';
    this.timeout = config.timeout || 30000;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response: Response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Request failed: Unknown error');
    }
  }

  /**
   * Get all publications
   */
  async getPublications(page: number = 1, limit: number = 10): Promise<PublicationsResponse> {
    return this.makeRequest<PublicationsResponse>(`/publications?page=${page}&limit=${limit}`);
  }

  /**
   * Get specific publication
   */
  async getPublication(id: string): Promise<{ success: boolean; data?: { publication: Publication }; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}`);
  }

  /**
   * Create new publication
   */
  async createPublication(data: Partial<Publication>): Promise<{ success: boolean; data?: { publication: Publication }; message?: string; error?: string }> {
    return this.makeRequest('/publications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Generate new publication
   */
  async generatePublication(request: GenerationRequest): Promise<GenerationResponse> {
    return this.makeRequest<GenerationResponse>('/publications/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Check generation status
   */
  async checkGenerationStatus(sessionId: string): Promise<GenerationStatus> {
    return this.makeRequest<GenerationStatus>(`/publications/generation-status/${sessionId}`);
  }

  /**
   * Bulk generate multiple publications
   */
  async bulkGeneratePublications(request: BulkGenerationRequest): Promise<BulkGenerationResponse> {
    return this.makeRequest<BulkGenerationResponse>('/publications/bulk-generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Check bulk generation status
   */
  async checkBulkGenerationStatus(bulkSessionId: string): Promise<BulkGenerationStatus> {
    return this.makeRequest<BulkGenerationStatus>('/publications/bulk-status', {
      method: 'POST',
      body: JSON.stringify({ bulk_session_id: bulkSessionId }),
    });
  }

  /**
   * Get company information
   */
  async getCompanyInfo(): Promise<CompanyResponse> {
    return this.makeRequest<CompanyResponse>('/company');
  }

  /**
   * Update company information
   */
  async updateCompanyInfo(companyData: Partial<CompanyData>): Promise<CompanyResponse> {
    return this.makeRequest<CompanyResponse>('/company', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  /**
   * Parse company website
   */
  async parseCompanyWebsite(websiteUrl: string): Promise<CompanyParsingResponse> {
    const request: CompanyParsingRequest = { website_url: websiteUrl };
    return this.makeRequest<CompanyParsingResponse>('/company/parse', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get company parsing status
   */
  async getCompanyParsingStatus(): Promise<CompanyParsingStatus> {
    return this.makeRequest<CompanyParsingStatus>('/company/parsing-status');
  }

  /**
   * Update publication
   */
  async updatePublication(id: string, data: Partial<Publication>): Promise<{ success: boolean; data?: { publication: Publication }; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete publication
   */
  async deletePublication(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Publish publication
   */
  async publishPublication(id: string): Promise<{ success: boolean; data?: { publication: Publication }; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}/publish`, {
      method: 'POST',
    });
  }

  /**
   * Archive publication
   */
  async archivePublication(id: string): Promise<{ success: boolean; data?: { publication: Publication }; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}/archive`, {
      method: 'POST',
    });
  }

  /**
   * Download publication
   */
  async downloadPublication(id: string, format: 'pdf' | 'docx' | 'html' | 'markdown' = 'pdf'): Promise<{ success: boolean; data?: { url: string }; message?: string; error?: string }> {
    return this.makeRequest(`/publications/${id}/download`, {
      method: 'POST',
      body: JSON.stringify({ format }),
    });
  }

  /**
   * Get all images
   */
  async getImages(page: number = 1, limit: number = 10): Promise<ImagesResponse> {
    return this.makeRequest<ImagesResponse>(`/images?page=${page}&limit=${limit}`);
  }

  /**
   * Get specific image
   */
  async getImage(id: string): Promise<{ success: boolean; data?: { image: Image }; message?: string; error?: string }> {
    return this.makeRequest(`/images/${id}`);
  }

  /**
   * Upload image
   */
  async uploadImage(file: File | Buffer, publicationId?: string): Promise<{ success: boolean; data?: { image: Image }; message?: string; error?: string }> {
    const formData = new FormData();
    
    if (file instanceof File) {
      formData.append('image', file);
    } else {
      // Handle Buffer for Node.js
      const blob = new Blob([file]);
      formData.append('image', blob, 'image.jpg');
    }
    
    if (publicationId) {
      formData.append('publicationId', publicationId);
    }

    return this.makeRequest('/images/upload', {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });
  }

  /**
   * Generate AI image
   */
  async generateImage(prompt: string, style: string = 'realistic', size: string = '1024x1024'): Promise<{ success: boolean; data?: { image: Image }; message?: string; error?: string }> {
    return this.makeRequest('/images/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, style, size }),
    });
  }

  /**
   * Delete image
   */
  async deleteImage(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
    return this.makeRequest(`/images/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    return this.makeRequest<SubscriptionStatus>('/subscription/status');
  }

  /**
   * Get subscription limits
   */
  async getSubscriptionLimits(): Promise<{ success: boolean; data?: { userLimits: any }; message?: string; error?: string }> {
    return this.makeRequest('/subscription/limits');
  }

  /**
   * Get available plans
   */
  async getSubscriptionPlans(): Promise<{ success: boolean; data?: { plans: any[] }; message?: string; error?: string }> {
    return this.makeRequest('/subscription/plans');
  }

  /**
   * Get overview statistics
   */
  async getStatisticsOverview(): Promise<StatisticsOverview> {
    return this.makeRequest<StatisticsOverview>('/statistics/overview');
  }

  /**
   * Get publication statistics
   */
  async getPublicationStatistics(): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
    return this.makeRequest('/statistics/publications');
  }

  /**
   * Get image statistics
   */
  async getImageStatistics(): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
    return this.makeRequest('/statistics/images');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ success: boolean; message?: string; timestamp?: string; version?: string; user?: any; limits?: any }> {
    return this.makeRequest('/health');
  }

  /**
   * Wait for generation to complete
   */
  async waitForGeneration(sessionId: string, maxAttempts: number = 60, delayMs: number = 5000): Promise<GenerationStatus> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.checkGenerationStatus(sessionId);
      
      if (status.success && status.data?.status === 'completed') {
        return status;
      }
      
      if (status.success && status.data?.status === 'failed') {
        throw new Error('Generation failed');
      }
      
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error('Generation timeout');
  }

  /**
   * Wait for bulk generation to complete
   */
  async waitForBulkGeneration(bulkSessionId: string, maxAttempts: number = 120, delayMs: number = 10000): Promise<BulkGenerationStatus> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.checkBulkGenerationStatus(bulkSessionId);
      
      if (status.success && status.data?.status === 'completed') {
        return status;
      }
      
      if (status.success && status.data?.status === 'failed') {
        throw new Error('Bulk generation failed');
      }
      
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error('Bulk generation timeout');
  }
} 