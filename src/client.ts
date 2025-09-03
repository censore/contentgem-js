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
  BulkStatusRequest,
  BulkStatusResponse,
  PlansResponse,
  ApiLimitsResponse
} from './types';

export class ContentGemClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: ContentGemConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://gemcontent.com/api/v1';
    this.timeout = config.timeout || 30000;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'x-api-key': this.apiKey,
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
  async getPublications(page: number = 1, limit: number = 10, type?: string, status?: string): Promise<PublicationsResponse> {
    let query = `?page=${page}&limit=${limit}`;
    if (type) query += `&type=${type}`;
    if (status) query += `&status=${status}`;
    
    return this.makeRequest<PublicationsResponse>(`/publications${query}`);
  }

  /**
   * Get specific publication
   */
  async getPublication(id: string): Promise<{ success: boolean; data?: Publication; message?: string; error?: string }> {
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
   * Bulk generate publications
   */
  async bulkGeneratePublications(request: BulkGenerationRequest): Promise<BulkGenerationResponse> {
    return this.makeRequest<BulkGenerationResponse>('/publications/bulk-generate', {
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
   * Check bulk generation status
   */
  async checkBulkGenerationStatus(request: BulkStatusRequest): Promise<BulkStatusResponse> {
    return this.makeRequest<BulkStatusResponse>('/publications/bulk-status', {
      method: 'POST',
      body: JSON.stringify(request),
    });
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
  async downloadPublication(id: string, format: 'pdf' | 'md' | 'txt' | 'zip' = 'pdf', title?: string, content?: string, images?: any[]): Promise<{ success: boolean; data?: { url: string }; message?: string; error?: string }> {
    const body: any = { format };
    if (title) body.title = title;
    if (content) body.content = content;
    if (images) body.images = images;

    return this.makeRequest(`/publications/${id}/download`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * Get publication statistics
   */
  async getPublicationStats(): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
    return this.makeRequest('/publications/stats');
  }

  /**
   * Get all images
   */
  async getImages(page: number = 1, limit: number = 10, publicationId?: string, search?: string): Promise<ImagesResponse> {
    let query = `?page=${page}&limit=${limit}`;
    if (publicationId) query += `&publicationId=${publicationId}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    
    return this.makeRequest<ImagesResponse>(`/images${query}`);
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
        'x-api-key': this.apiKey,
        // Don't set Content-Type for FormData
      },
      body: formData,
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
   * Get company information
   */
  async getCompanyInfo(): Promise<{ success: boolean; data?: CompanyInfo; message?: string; error?: string }> {
    return this.makeRequest('/company');
  }

  /**
   * Update company information
   */
  async updateCompanyInfo(companyInfo: Partial<CompanyInfo>): Promise<{ success: boolean; data?: CompanyInfo; message?: string; error?: string }> {
    return this.makeRequest('/company', {
      method: 'PUT',
      body: JSON.stringify(companyInfo),
    });
  }

  /**
   * Parse company website
   */
  async parseCompanyWebsite(urls: string[]): Promise<{ success: boolean; data?: CompanyInfo; message?: string; error?: string }> {
    return this.makeRequest('/company/parse', {
      method: 'POST',
      body: JSON.stringify({ urls }),
    });
  }

  /**
   * Get company parsing status
   */
  async getCompanyParsingStatus(): Promise<{ success: boolean; data?: { parsingStatus: string; canParseAgain: boolean; lastParsedAt?: string }; message?: string; error?: string }> {
    return this.makeRequest('/company/parsing-status');
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    return this.makeRequest<SubscriptionStatus>('/subscription/status');
  }

  /**
   * Get available plans
   */
  async getSubscriptionPlans(): Promise<PlansResponse> {
    return this.makeRequest<PlansResponse>('/subscription/plans');
  }

  /**
   * Get subscription limits and API rate limits
   */
  async getSubscriptionLimits(): Promise<ApiLimitsResponse> {
    return this.makeRequest<ApiLimitsResponse>('/subscription/limits');
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
  async waitForBulkGeneration(publicationIds: string[], maxAttempts: number = 60, delayMs: number = 10000): Promise<BulkStatusResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const status = await this.checkBulkGenerationStatus({ publicationIds });
      
      if (status.success && status.data) {
        const { completedCount, failedCount, totalChecked } = status.data;
        if (completedCount + failedCount >= totalChecked) {
          return status;
        }
      }
      
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    throw new Error('Bulk generation timeout');
  }
} 