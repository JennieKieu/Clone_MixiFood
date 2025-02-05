import {
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // upload avatar, ...
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // limit file upload
          new MaxFileSizeValidator({
            maxSize: 52428800,
            message: 'File is too large. Max file size is 50MB',
          }),
          // fileType images
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.uploadProfile(file);
  }

  @Post('testRemove')
  @UseInterceptors(FileInterceptor('file'))
  async testRemove(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // limit file upload
          new MaxFileSizeValidator({
            maxSize: 52428800,
            message: 'File is too large. Max file size is 50MB',
          }),
          // fileType images
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(await this.uploadService.removeImageBackground(file));
    // return await this.uploadService.removeImageBackground(file);

    return await this.uploadService.removeImageBackground(file);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    return await this.uploadService.deleteFile(key);
  }
}
