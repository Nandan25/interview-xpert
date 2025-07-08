export const conceptExplanationPrompt = (question: string) => {
  return (`You are an AI trained to explain technical interview questions clearly for beginner developers.
  
  Task:
  - Provide a detailed and beginner-friendly explanation for the following interview question:
  "${question}"
  
  - Include a brief, descriptive title summarizing the concept.
  - If relevant, add a small code example (in JavaScript, if language isn't specified).
  - Ensure the explanation is cleanly formatted and easy to understand.
  - Return the result strictly as a valid JSON object, with the following structure:
  
  {
    "title": "A concise title here",
    "explanation": "The full explanation here, including code if needed."
  }
  
  Important:
  - Only return the JSON object.
  - Do NOT include any additional text, notes, markdown, or explanations outside the JSON.
  `);
};

export const questionAnswerPrompt = (
  role: string,
  experience: number,
  focusTopics: string,
  numberOfQuestions: number
) => {
  return (`You are an AI specialized in generating technical interview questions and beginner-friendly answers.
  
  Context:
  - Role: ${role}
  - Candidate Experience: ${experience} years
  - Focus Topics: ${focusTopics}
  
  
  Task:
  - Generate ${numberOfQuestions} interview questions tailored to the role and experience level.
  - For each question, include a concise, beginner-friendly answer.
  - Add a code example where applicable (preferably in JavaScript unless the role suggests otherwise).
  - Format everything cleanly and clearly.
  
  Output Format:
  Return a valid JSON array structured like this:
  
  [
    {
      "question": "First question here",
      "answer": "Detailed answer here, including code if needed"
    },
    ...
  ]
  
  Important:
  - Only return the JSON array.
  - Do NOT include any additional commentary or explanation outside the JSON format.
  `);
};

export const addMoreQuestionPrompt = (
  role: string,
  experience: number,
  focusTopics: string,
  numberOfQuestions: number,
  existingQuestionStrings: string[] = []
) => {
  let prompt = `You are an AI specialized in generating technical interview questions and beginner-friendly answers.

Context:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${focusTopics}

Task:
- Generate ${numberOfQuestions} interview questions tailored to the role and experience level.
- For each question, include a detailed, beginner-friendly answer.
- Add a code example where applicable (preferably in JavaScript unless the role suggests otherwise).
- Format everything cleanly and clearly.
`;

  // Add the exclusion instruction ONLY if there are existing questions
  if (existingQuestionStrings.length > 0) {
    prompt += `
Important: Do NOT generate any of the following questions again:
${existingQuestionStrings.map(q => `- "${q}"`).join('\n')}
`;
  }

  prompt += `
Output Format:
Return a valid JSON array structured like this:

[
{
  "question": "First question here",
  "answer": "Detailed answer here, including code if needed"
},
...
]

Important:
- Only return the JSON array.
- Do NOT include any additional commentary or explanation outside the JSON format.
`;

  return prompt;
};