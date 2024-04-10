import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt } = options;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        Te serán provistos textos en español con posibles errores ortográficos y gramaticales. Las palabras usadas deben existir en Real Academia Española. Debes responder en formato json, tu tarea es corregirlos y retornar información sobre los errores encontrados. También debes dar un porcentaje de acierto por el usuario. Si no hay errores, debes retornar un mensaje de felicitaciones.

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
    model: 'gpt-3.5-turbo-1106',
    temperature: 0.3,
    max_tokens: 100,
    response_format: {
      type: 'json_object',
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};
