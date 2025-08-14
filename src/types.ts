export interface ContentGemConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface CompanyInfo {
  name?: string;
  description?: string;
  industry?: string;
  target_audience?: string;
  content_preferences?: {
    length?: 'short' | 'medium' | 'long';
    style?: 'educational' | 'conversational' | 'professional' | 'casual';
    include_examples?: boolean;
    include_statistics?: boolean;
    include_images?: boolean;
  };
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
}

export interface BulkGenerationRequest {
  prompts: string[];
  company_info?: CompanyInfo;
  common_settings?: {
    length?: 'short' | 'medium' | 'long';
    style?: 'educational' | 'conversational' | 'professional' | 'casual';
    include_examples?: boolean;
    include_statistics?: boolean;
    include_images?: boolean;
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  };
}

export interface BulkGenerationResponse {
  success: boolean;
  data?: {
    bulk_session_id: string;
    total_prompts: number;
    status: 'processing' | 'completed' | 'failed';
    publications: Array<{
      id: string;
      prompt: string;
      status: 'pending' | 'generating' | 'completed' | 'failed';
    }>;
  };
  message?: string;
  error?: string;
}

export interface BulkGenerationStatus {
  success: boolean;
  data?: {
    bulk_session_id: string;
    total_prompts: number;
    completed_prompts: number;
    failed_prompts: number;
    status: 'processing' | 'completed' | 'failed';
    publications: Array<{
      id: string;
      title?: string;
      prompt: string;
      status: 'pending' | 'generating' | 'completed' | 'failed';
      content?: string;
      error?: string;
    }>;
  };
  message?: string;
  error?: string;
}

export interface CompanyData {
  name?: string;
  description?: string;
  industry?: string;
  website?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  logo_url?: string;
  founded_year?: number;
  employee_count?: string;
  revenue?: string;
  target_audience?: string;
  services?: string[];
  keywords?: string[];
}

export interface CompanyResponse {
  success: boolean;
  data?: {
    company: CompanyData;
    last_updated: string;
    parsing_history?: Array<{
      url: string;
      status: 'success' | 'failed';
      timestamp: string;
      extracted_data?: Partial<CompanyData>;
    }>;
  };
  message?: string;
  error?: string;
}

export interface CompanyParsingRequest {
  website_url: string;
}

export interface CompanyParsingResponse {
  success: boolean;
  data?: {
    parsing_session_id: string;
    status: 'processing' | 'completed' | 'failed';
    message?: string;
  };
  message?: string;
  error?: string;
}

export interface CompanyParsingStatus {
  success: boolean;
  data?: {
    parsing_session_id: string;
    status: 'processing' | 'completed' | 'failed';
    progress?: number;
    extracted_data?: Partial<CompanyData>;
    error?: string;
  };
  message?: string;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
  company_info?: CompanyInfo;
  keywords?: string[];
}

export interface GenerationResponse {
  success: boolean;
  data?: {
    publicationId: string;
    sessionId: string;
    status: string;
  };
  message?: string;
  error?: string;
}

export interface GenerationStatus {
  success: boolean;
  data?: {
    publicationId: string;
    sessionId: string;
    status: 'generating' | 'completed' | 'failed';
    stepName?: string;
    content?: string;
    blogTopic?: string;
    metadata?: any;
    timestamp?: string;
  };
  message?: string;
  error?: string;
}

export interface Publication {
  id: string;
  title: string;
  content: string;
  type: 'blog' | 'review';
  status: 'draft' | 'published' | 'archived';
  metaTitle?: string;
  metaDescription?: string;
  companyName?: string;
  companyDescription?: string;
  companyIndustry?: string;
  companyTargetAudience?: string;
  topic?: string;
  structure?: any;
  images?: any[];
  qualityScore?: number;
  contentLength: number;
  imagesCount: number;
  generationTimeSeconds?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PublicationsResponse {
  success: boolean;
  data?: {
    publications: Publication[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    stats: Record<string, number>;
    userLimits: {
      postsUsed: number;
      postsRemaining: number;
      planName: string;
      postsPerMonth: number;
    };
  };
  message?: string;
  error?: string;
}

export interface Image {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  prompt?: string;
  tags?: string[];
  publicationId?: string;
  createdAt: string;
}

export interface ImagesResponse {
  success: boolean;
  data?: {
    images: Image[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
  message?: string;
  error?: string;
}

export interface SubscriptionStatus {
  success: boolean;
  data?: {
    subscription: {
      planName: string;
      planSlug: string;
      price: number;
      currency: string;
      interval: string;
      postsPerMonth: number;
      postsUsed: number;
      postsRemaining: number;
      status: string;
      currentPeriodStart: string;
      currentPeriodEnd: string;
      cancelAtPeriodEnd: boolean;
      features: Array<{
        name: string;
        description: string;
        included: boolean;
      }>;
    };
  };
  message?: string;
  error?: string;
}

export interface StatisticsOverview {
  success: boolean;
  data?: {
    publications: Record<string, number>;
    images: {
      totalImages: number;
      totalSize: number;
      averageSize: number;
    };
    apiKeys: {
      totalKeys: number;
      activeKeys: number;
      totalRequests: number;
    };
    userLimits: {
      postsUsed: number;
      postsRemaining: number;
      planName: string;
      postsPerMonth: number;
    };
  };
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  status?: number;
} 