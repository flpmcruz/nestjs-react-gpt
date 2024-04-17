import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  getAudioUseCase,
  audioToTextUseCase,
  getImageUseCase,
  imageGenerationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
  imageVariationUseCase,
} from './use-cases';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrtographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

@Injectable()
export class GptService {
  async orthographyCheck(ortographyDto: OrtographyDto, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    return await orthographyCheckUseCase(openai, {
      prompt: ortographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    return await prosConsDicusserUseCase(openai, { prompt });
  }

  async translate({ prompt, lang }: TranslateDto, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    return await translateUseCase(openai, { prompt, lang });
  }

  async imageGeneration(
    imageGenerationDto: ImageGenerationDto,
    apiKey: string,
  ) {
    const openai = new OpenAI({ apiKey });
    return await imageGenerationUseCase(openai, { ...imageGenerationDto });
  }

  async imageVariation({ baseImage }: ImageVariationDto, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    return await imageVariationUseCase(openai, { baseImage });
  }

  async textToAudio({ prompt, voice }: TextToAudioDto, apiKey: string) {
    const openai = new OpenAI({ apiKey });
    return await textToAudioUseCase(openai, { prompt, voice });
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
    apiKey: string,
  ) {
    const { prompt } = audioToTextDto;
    const openai = new OpenAI({ apiKey });
    return await audioToTextUseCase(openai, { prompt, audioFile });
  }

  async getImage(fileId: string) {
    return await getImageUseCase(fileId);
  }

  async getAudio(fileId: string) {
    return await getAudioUseCase(fileId);
  }

  async prosConsDicusserStream(
    { prompt }: ProsConsDiscusserDto,
    apiKey: string,
  ) {
    const openai = new OpenAI({ apiKey });
    return await prosConsDicusserStreamUseCase(openai, { prompt });
  }
}
