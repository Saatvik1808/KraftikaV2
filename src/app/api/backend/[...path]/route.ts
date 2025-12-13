import { NextRequest, NextResponse } from 'next/server';

// Backend URL for server-side proxy
// This can be overridden with BACKEND_API_URL environment variable
// Default based on environment: localhost for dev, production URL for production
const BACKEND_URL = process.env.BACKEND_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'http://65.2.121.137/api' 
    : 'http://localhost:5000/api');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleRequest(request, resolvedParams, 'PATCH');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path.join('/');
    const url = new URL(request.url);
    const queryString = url.search;
    
    // Build the backend URL
    const backendUrl = `${BACKEND_URL}/${path}${queryString}`;
    
    console.log(`[Proxy] ${method} ${path} -> ${backendUrl}`);
    
    // Get headers from the request
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };
    
    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const body = await request.text();
        if (body) {
          requestOptions.body = body;
        }
      } catch (error) {
        // If body parsing fails, continue without body
        console.warn('[Proxy] Failed to parse request body:', error);
      }
    }
    
    // Make the request to the backend
    const response = await fetch(backendUrl, requestOptions);
    
    // Get the response data
    const data = await response.text();
    
    // Try to parse as JSON, fallback to text
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }
    
    console.log(`[Proxy] Response status: ${response.status}`);
    
    // Return the response with appropriate headers
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[Proxy] Error:', error);
    console.error('[Proxy] Backend URL:', BACKEND_URL);
    console.error('[Proxy] Target URL:', `${BACKEND_URL}/${params.path.join('/')}`);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Provide more helpful error message
    let userMessage = errorMessage;
    if (errorMessage.includes('fetch failed') || errorMessage.includes('ECONNREFUSED')) {
      userMessage = `Cannot connect to backend server at ${BACKEND_URL}. Please check if the backend is running and accessible.`;
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to proxy request', 
        message: userMessage,
        backendUrl: process.env.NODE_ENV === 'development' ? BACKEND_URL : undefined,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}

