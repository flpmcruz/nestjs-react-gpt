import * as path from 'path';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

export const getImageUseCase = async (fileId: string) => {
  const file = path.resolve(__dirname, `../../../generated/images/${fileId}`);
  if (!fs.existsSync(file)) new NotFoundException('File not found');
  return file;
};
