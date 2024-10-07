// app/api/ai/route.ts

import { NextResponse } from 'next/server';
import { searchTopic, generateLessonPlan, generateLessonContent } from '@/lib/ai-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log('API route called');
  try {
    const body = await request.json();
    console.log('Request body:', body);

    const { action, payload } = body;

    if (!action) {
      console.log('Missing "action" in request body.');
      return NextResponse.json({ error: 'Missing "action" in request body.' }, { status: 400 });
    }

    if (!payload) {
      console.log('Missing "payload" in request body.');
      return NextResponse.json({ error: 'Missing "payload" in request body.' }, { status: 400 });
    }

    let result;
    switch (action) {
      case 'searchTopic':
        if (typeof payload.topic !== 'string') {
          console.log('"topic" must be a string.');
          return NextResponse.json({ error: '"topic" must be a string.' }, { status: 400 });
        }
        console.log('Searching topic:', payload.topic);
        result = await searchTopic(payload.topic);
        console.log('Search result:', result);
        break;
      case 'generateLessonPlan':
        if (
          !payload.topic ||
          typeof payload.topic !== 'string' ||
          !payload.summary ||
          typeof payload.summary !== 'string'
        ) {
          console.log('Invalid payload for "generateLessonPlan".');
          return NextResponse.json(
            { error: 'Invalid or missing "topic" or "summary" in payload.' },
            { status: 400 }
          );
        }
        console.log('Generating lesson plan:', payload);
        result = await generateLessonPlan(payload);
        console.log('Lesson plan result:', result);
        break;
      case 'generateLessonContent':
        if (
          !payload.title ||
          typeof payload.title !== 'string' ||
          !payload.description ||
          typeof payload.description !== 'string' ||
          !payload.topic ||
          typeof payload.topic !== 'string' ||
          !payload.summary ||
          typeof payload.summary !== 'string'
        ) {
          console.log('Invalid payload for "generateLessonContent".');
          return NextResponse.json(
            { error: 'Invalid or missing "title", "description", "topic", or "summary" in payload.' },
            { status: 400 }
          );
        }
        console.log('Generating lesson content:', payload);
        result = await generateLessonContent(payload.title, payload.description, payload.topic, payload.summary);
        console.log('Lesson content result:', result);
        break;
      default:
        console.log('Invalid action:', action);
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log('Returning result:', result);
    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('API Route Error:', error.message);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
        { status: 500 }
      );
    } else {
      console.error('API Route Error:', error);
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred.',
        },
        { status: 500 }
      );
    }
  }
}
