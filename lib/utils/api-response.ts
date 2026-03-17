import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type ApiResponseType<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Create an error API response
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: unknown
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Create a paginated API response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): NextResponse<SuccessResponse<PaginatedData<T>>> {
  return NextResponse.json({
    success: true,
    data: {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}

/**
 * Handle async API route errors
 */
export async function withErrorHandler<T>(
  handler: () => Promise<NextResponse<ApiResponseType<T>>>
): Promise<NextResponse<ApiResponseType<T>>> {
  try {
    return await handler();
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('validation')) {
        return errorResponse(error.message, 400) as NextResponse<ApiResponseType<T>>;
      }
      if (error.message.includes('not found')) {
        return errorResponse(error.message, 404) as NextResponse<ApiResponseType<T>>;
      }
      if (error.message.includes('unauthorized')) {
        return errorResponse(error.message, 401) as NextResponse<ApiResponseType<T>>;
      }
      if (error.message.includes('forbidden')) {
        return errorResponse(error.message, 403) as NextResponse<ApiResponseType<T>>;
      }
      return errorResponse(error.message, 500) as NextResponse<ApiResponseType<T>>;
    }
    
    return errorResponse('An unexpected error occurred', 500) as NextResponse<ApiResponseType<T>>;
  }
}

/**
 * Parse query parameters with defaults
 */
export function parseQueryParams(searchParams: URLSearchParams) {
  return {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
  };
}
