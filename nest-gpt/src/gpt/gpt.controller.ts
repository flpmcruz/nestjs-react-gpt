import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  Headers,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Response } from 'express';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrtographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('gpt')
@UseGuards(AuthGuard)
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(
    @Body() ortographyDto: OrtographyDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.orthographyCheck(ortographyDto, apiKey);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto, apiKey);
  }

  @Post('translate')
  translate(
    @Body() translate: TranslateDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.translate({ ...translate }, apiKey);
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body()
    textToAudioDto: TextToAudioDto,
    @Res() res: Response,
    @Headers('api-key') apiKey: string,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto, apiKey);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(
    @Body() imageVariationDto: ImageVariationDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.imageVariation(imageVariationDto, apiKey);
  }

  @Post('image-generation')
  async imageGeneration(
    @Body() imageGenerationDto: ImageGenerationDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.imageGeneration(imageGenerationDto, apiKey);
  }

  @Get('image-generation/:fileId')
  async imageGenerationGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.getImage(fileId);
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb ',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
    @Headers('api-key') apiKey: string,
  ) {
    return this.gptService.audioToText(file, audioToTextDto, apiKey);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = await this.gptService.getAudio(fileId);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
    @Headers('api-key') apiKey: string,
  ) {
    const stream = await this.gptService.prosConsDicusserStream(
      prosConsDiscusserDto,
      apiKey,
    );

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      res.write(piece);
    }
    res.end();
  }
}
