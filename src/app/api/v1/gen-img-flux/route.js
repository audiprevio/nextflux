import { NextResponse } from 'next/server';
import * as fal from '@fal-ai/serverless-client';

// Handle POST request to generate image
export async function POST(request) {
  try {
    const { prompt, context } = await request.json(); // Get both prompt and context from request body

    // Combine context and prompt into a single query
    const combinedPrompt = context ? `${context} ${prompt}` : prompt;

    // Log the combined prompt
    console.log('Prompt sent to FAL:', combinedPrompt);

    // Call FAL API with the combined prompt
    const result = await fal.subscribe('fal-ai/flux/dev', {
      input: { prompt: combinedPrompt }, // Send the combined prompt
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          update.logs.map((log) => console.log(log.message));
        }
      },
    });

    return NextResponse.json({ result }); // Send result back as a JSON response
  } catch (error) {
    console.error('Error calling FAL API:', error);

    // Extract status code and message from the error
    const statusCode = error.status || 500;
    const errorMessage = error.body?.detail || error.message || 'Internal Server Error';

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
