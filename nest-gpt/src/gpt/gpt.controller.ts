import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrtographyDto } from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() ortographyDto: OrtographyDto) {
    return this.gptService.orthographyCheck(ortographyDto);
  }
}