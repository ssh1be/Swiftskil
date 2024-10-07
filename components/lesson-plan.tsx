// lesson-plan.tsx

"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react'; // Optional: For loading indicators
import { toast } from 'sonner'; // Assuming you use this for notifications
import Quiz from '@/components/Quiz'; // Import the Quiz component

export default function LessonPlan({ plan }) {
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState({});
  const [loadingLessonId, setLoadingLessonId] = useState(null); // Track loading state per lesson

  const handleExpandLesson = async (lessonId) => {
    // Toggle expansion
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
      return;
    }

    setExpandedLesson(lessonId);

    // If content is already fetched, no need to fetch again
    if (lessonContent[lessonId]) {
      return;
    }

    setLoadingLessonId(lessonId); // Start loading

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateLessonContent',
          payload: {
            title: plan.lessons[lessonId].title,
            description: plan.lessons[lessonId].description,
            topic: plan.topic,     // Ensure 'topic' is available in the plan
            summary: plan.summary, // Ensure 'summary' is available in the plan
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Failed to generate lesson content.');
      }

      const content = await response.json();
      setLessonContent((prev) => ({ ...prev, [lessonId]: content }));
    } catch (error) {
      console.error('Error generating lesson content:', error);
      toast.error(`Failed to load lesson content: ${error.message}`);
    } finally {
      setLoadingLessonId(null); // End loading
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {plan.lessons.map((lesson, index) => (
            <AccordionItem key={index} value={`lesson-${index}`}>
              <AccordionTrigger>{lesson.title}</AccordionTrigger>
              <AccordionContent>
                <p>{lesson.description}</p>
                <Button
                  onClick={() => handleExpandLesson(index)}
                  className="mt-2"
                  disabled={loadingLessonId === index} // Disable button while loading
                >
                  {loadingLessonId === index ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    expandedLesson === index ? 'Hide Content' : 'Show Content'
                  )}
                </Button>
                {expandedLesson === index && lessonContent[index] && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Lesson Content:</h4>
                    <ReactMarkdown>{lessonContent[index].content}</ReactMarkdown> {/* Render Markdown */}

                    <Quiz quiz={lessonContent[index].quiz} /> {/* Render Quiz */}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
