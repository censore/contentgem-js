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
    include_custom_templates?: boolean;
  };
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  services?: string[];
  expertise?: string[];
  values?: string[];
  mission?: string;
  vision?: string;
  website?: string;
  socialMedia?: Record<string, string>;
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
    status: 'generating' | 'completed' | 'failed' | 'in_progress';
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
  sessionId?: string;
  initialPrompt?: string;
  generatedBy?: 'web' | 'api';
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
    stats: {
      total: number;
      published: number;
      draft: number;
      archived: number;
      thisMonth: number;
      averageQualityScore?: number;
      totalContentLength?: number;
    };
    userLimits: {
      postsUsed: number;
      postsRemaining: number;
      planName: string;
      planSlug: string;
      postsPerMonth: number;
      features: Array<{
        featureId?: {
          name: string;
          description: string;
          identifier: string;
        };
        included: boolean;
      }>;
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
  publicUrl: string;
  prompt?: string;
  sectionTitle?: string;
  tags?: string[];
  publicationId?: string;
  sessionId?: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  isMainImage?: boolean;
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
    stats: {
      totalImages: number;
      totalSize: number;
      averageSize: number;
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
    publications: {
      total: number;
      published: number;
      draft: number;
      archived: number;
      thisMonth: number;
    };
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

export interface BulkGenerationRequest {
  prompts: string[];
  settings?: {
    company_info?: CompanyInfo;
    keywords?: string[];
  };
}

export interface BulkGenerationResponse {
  success: boolean;
  data?: {
    totalPrompts: number;
    successCount: number;
    errorCount: number;
    publications: Array<{
      id: string;
      sessionId: string;
    }>;
  };
  message?: string;
  error?: string;
}



export interface Plan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  postsPerMonth: number;
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  version: number;
  stripePriceId: string;
  stripeProductId: string;
}

export interface PlansResponse {
  success: boolean;
  data?: Plan[];
  message?: string;
  error?: string;
}

export interface ApiLimitsResponse {
  success: boolean;
  data?: {
    rateLimits: {
      general: {
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      contentGeneration: {
        requestsPer5Minutes: number;
      };
      statusChecks: {
        requestsPerMinute: number;
      };
    };
    subscriptionLimits: Array<{
      name: string;
      slug: string;
      postsPerMonth: number;
      price: number;
      currency: string;
      interval: string;
      hasApiAccess: boolean;
      features: Array<{
        name: string;
        description: string;
        included: boolean;
      }>;
    }>;
    userLimits?: {
      postsUsed: number;
      postsRemaining: number;
      planName: string;
      planSlug: string;
      postsPerMonth: number;
      features: any[];
    };
  };
  message?: string;
  error?: string;
}

export interface BulkGenerationRequest {
  prompts: string[];
  settings?: {
    company_info?: CompanyInfo;
    keywords?: string[];
  };
}

export interface BulkGenerationResponse {
  success: boolean;
  data?: {
    totalPrompts: number;
    successCount: number;
    errorCount: number;
    publications: Array<{
      id: string;
      sessionId: string;
    }>;
  };
  message?: string;
  error?: string;
}

export interface BulkStatusRequest {
  publicationIds: string[];
}

export interface BulkStatusResponse {
  success: boolean;
  data?: {
    publicationStatuses: Array<{
      id: string;
      sessionId?: string;
      status: string;
      stepName?: string;
      title?: string;
      topic?: string;
      content?: string;
      metadata?: any;
      created_at: string;
    }>;
    totalChecked: number;
    completedCount: number;
    failedCount: number;
    inProgressCount: number;
    createdCount: number;
  };
  message?: string;
  error?: string;
}

export interface Plan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  postsPerMonth: number;
  features: Array<{
    name: string;
    description: string;
    included: boolean;
  }>;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
  version: number;
  stripePriceId: string;
  stripeProductId: string;
}

export interface PlansResponse {
  success: boolean;
  data?: Plan[];
  message?: string;
  error?: string;
}

export interface ApiLimitsResponse {
  success: boolean;
  data?: {
    rateLimits: {
      general: {
        requestsPerMinute: number;
        requestsPerHour: number;
      };
      contentGeneration: {
        requestsPer5Minutes: number;
      };
      statusChecks: {
        requestsPerMinute: number;
      };
    };
    subscriptionLimits: Array<{
      name: string;
      slug: string;
      postsPerMonth: number;
      price: number;
      currency: string;
      interval: string;
      hasApiAccess: boolean;
      features: Array<{
        name: string;
        description: string;
        included: boolean;
      }>;
    }>;
    userLimits?: {
      postsUsed: number;
      postsRemaining: number;
      planName: string;
      planSlug: string;
      postsPerMonth: number;
      features: any[];
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