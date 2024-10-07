// Import necessary modules and initialize environment variables
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface QuizQuestion {
  question: string;
  options: string[]; // Array of 4 options
  correctAnswer: string;
}

// TypeScript Interfaces for Type Safety
interface Lesson {
  title: string;
  description: string;
}

export interface LessonContent {
  content: string;
  quiz: QuizQuestion[];
}

export interface LessonPlan {
  title: string;
  topic: string;
  summary: string;
  lessons: Lesson[];
}

interface SearchResult {
  topic: string;
  summary: string;
}

// Check for the OpenAI API key before initializing the client
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OpenAI API key is not set in environment variables.');
}

// Initialize OpenAI client with the API key
const openai = new OpenAI({
  apiKey,
});

/**
 * Searches for a topic and provides a brief summary using OpenAI's API.
 * @param topic The topic to search for.
 * @returns An object containing the topic and its summary.
 */
export async function searchTopic(topic: string): Promise<SearchResult> {
  try {
    console.log('Searching topic:', topic);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Ensure the model name is correct
      messages: [
        {
          role: 'system',
          content: 'You are an AI tutor tasked with providing a brief summary of a given topic.',
        },
        {
          role: 'user',
          content: `Provide a brief summary of the topic: ${topic}`,
        },
      ],
      max_tokens: 150,
    });

    console.log('OpenAI response:', JSON.stringify(completion, null, 2));

    const message = completion.choices?.[0]?.message?.content?.trim();
    if (!message) {
      throw new Error('Received empty summary from OpenAI API');
    }

    return {
      topic,
      summary: message,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Detailed error in searchTopic:', error.message);
      throw error;
    } else {
      console.error('Unexpected error in searchTopic:', error);
      throw new Error('An unexpected error occurred in searchTopic.');
    }
  }
}

/**
 * Generates a lesson plan based on the provided topic and summary.
 * @param payload An object containing the topic and its summary.
 * @returns A lesson plan object.
 */
export async function generateLessonPlan(payload: SearchResult): Promise<LessonPlan> {
  try {
    console.log('Generating lesson plan for:', payload.topic);

    const prompt = `
      Create a detailed lesson plan for the topic "${payload.topic}" based on the following summary: ${payload.summary}. The lesson plan should include the following:

      1. Title of the Lesson Plan
      2. A list of lessons with titles and brief descriptions
      3. Each lesson should cover specific aspects of the topic

      **Please provide the lesson plan in JSON format only, enclosed within triple backticks as shown below:**

      \`\`\`json
      {
        "title": "Lesson Plan Title",
        "topic": "Softball",
        "summary": "Brief summary of the topic.",
        "lessons": [
          { "title": "Lesson 1", "description": "Description of Lesson 1" },
          { "title": "Lesson 2", "description": "Description of Lesson 2" },
          { "title": "Lesson 3", "description": "Description of Lesson 3" },
          { "title": "Lesson 4", "description": "Description of Lesson 4" }
        ]
      }
      \`\`\`
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Ensure the model name is correct
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant that creates detailed lesson plans.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.7, // Adjust for creativity if needed
    });

    console.log('OpenAI response for lesson plan:', JSON.stringify(completion, null, 2));

    const lessonPlanText = completion.choices?.[0]?.message?.content?.trim();
    if (!lessonPlanText) {
      throw new Error('Received empty lesson plan from OpenAI API');
    }

    // Extract JSON from code fences
    const jsonMatch = lessonPlanText.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) {
      throw new Error('Lesson plan is not in JSON format.');
    }

    const jsonString = jsonMatch[1].trim();
    let lessonPlan: LessonPlan;

    try {
      lessonPlan = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse lesson plan JSON:', parseError);
      throw new Error('Invalid lesson plan JSON received from OpenAI.');
    }

    // Validate that required fields are present
    if (!lessonPlan.title || !lessonPlan.topic || !lessonPlan.summary || !lessonPlan.lessons) {
      throw new Error('Lesson plan is missing required fields.');
    }

    console.log('Generated lesson plan:', lessonPlan);
    return lessonPlan;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in generateLessonPlan:', error.message);
      throw error;
    } else {
      console.error('Unexpected error in generateLessonPlan:', error);
      throw new Error('An unexpected error occurred while generating lesson plan.');
    }
  }
}



/**
 * Generates detailed content and quizzes for a specific lesson.
 * @param lesson An object containing the lesson title and description.
 * @returns An object containing the lesson content and quiz questions.
 */
export async function generateLessonContent(title: string, description: string, topic: string, summary: string): Promise<LessonContent> {
  try {
    console.log('Generating lesson content for:', title);

    const prompt = `
      You are an educational assistant that creates detailed lesson content and quizzes.

      Topic: ${topic}
      Lesson Title: ${title}
      Lesson Description: ${description}
      Summary: ${summary}

      **Please provide the lesson content and quiz questions in JSON format only, enclosed within triple backticks as shown below:**

      \`\`\`json
      {
        "content": "Detailed lesson content here...",
        "quiz": [
          {
            "question": "Quiz question 1",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option B"
          },
          {
            "question": "Quiz question 2",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option D"
          },
          {
            "question": "Quiz question 3",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A"
          }
        ]
      }
      \`\`\`
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Ensure the model name is correct
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant that creates detailed lesson content and quizzes.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000, // Increased to accommodate more content
      temperature: 0.7, // Adjust for creativity if needed
    });

    console.log('OpenAI response for lesson content:', JSON.stringify(completion, null, 2));

    const lessonContentText = completion.choices?.[0]?.message?.content?.trim();
    if (!lessonContentText) {
      throw new Error('Received empty content from OpenAI API');
    }

    // Extract JSON from code fences
    const jsonMatch = lessonContentText.match(/```json([\s\S]*?)```/);
    if (!jsonMatch) {
      throw new Error('Lesson content is not in JSON format.');
    }

    const jsonString = jsonMatch[1].trim();
    let lessonContent: LessonContent;

    try {
      lessonContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse lesson content JSON:', parseError);
      throw new Error('Invalid lesson content JSON received from OpenAI.');
    }

    // Validate that required fields are present
    if (!lessonContent.content || !Array.isArray(lessonContent.quiz)) {
      throw new Error('Lesson content is missing required fields.');
    }

    console.log('Generated lesson content:', lessonContent);
    return lessonContent;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error in generateLessonContent:', error.message);
      throw error;
    } else {
      console.error('Unexpected error in generateLessonContent:', error);
      throw new Error('An unexpected error occurred while generating lesson content.');
    }
  }
}
