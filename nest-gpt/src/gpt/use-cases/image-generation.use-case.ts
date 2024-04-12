import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { downloadBase64ImageAsPng, downloadImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, maskImage, originalImage } = options;

  // Generate image
  if (!originalImage || !maskImage) {
    const response = await openai.images.generate({
      prompt,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = path.join(
      process.env.SERVER_URL,
      'gpt',
      'image-generation',
      fileName,
    );

    return {
      localUrl: url,
      openAIUrl: response.data[0].url,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // Edit image
  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  const response = await openai.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const fileName = await downloadImageAsPng(response.data[0].url);
  const url = path.join(
    process.env.SERVER_URL,
    'gpt',
    'image-generation',
    fileName,
  );

  return {
    localUrl: url,
    openAIUrl: response.data[0].url,
    revised_prompt: response.data[0].revised_prompt,
  };
};
