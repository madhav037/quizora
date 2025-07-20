export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): Response {
  return Response.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(
  error: string,
  status: number = 400,
  details?: any
): Response {
  return Response.json(
    {
      success: false,
      error,
      details,
    },
    { status }
  );
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    if (error.message.includes('Validation error')) {
      return errorResponse(error.message, 400);
    }
    
    if (error.message.includes('not found')) {
      return errorResponse('Resource not found', 404);
    }
    
    if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      return errorResponse('Unauthorized', 403);
    }
  }
  
  return errorResponse('Internal server error', 500);
}