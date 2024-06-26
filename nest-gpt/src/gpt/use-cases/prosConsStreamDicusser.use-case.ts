import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras, la respuesta debe de ser en formato markdown, los pros y contras deben de estar en una lista.

        Ejemplo de salida:
        {
          userScore: number,
          errors: string[], //['error -> solución'],
          message: string, // Usa emojis y texto para felicitar al usuario
        }
      `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    stream: true,
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.8,
    max_tokens: 500,
  });
};
