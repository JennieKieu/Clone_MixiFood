import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
const { uuid } = require('uuidv4');
import * as FormData from 'form-data'; // Sử dụng form-data cho Node.js
import { HttpService } from '@nestjs/axios';
import path from 'path';
import * as fs from 'fs';
import rembg from '@remove-background-ai/rembg.js';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.get('awsRegion'),
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async uploadProfile(file: Express.Multer.File) {
    try {
      const key = `${uuid()}`;
      // console.log(key);
      const command = new PutObjectCommand({
        Bucket: this.configService.get('s3BucketName'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',

        Metadata: {
          originalName: file.originalname,
        },
      });

      const uploadResult = await this.s3Client.send(command);

      return {
        url: (await this.getFileUrl(key)).url,
        key,
        uploadResult,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAvatar(file: Express.Multer.File) {
    try {
      const key = `${uuid()}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('s3BucketName'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',

        Metadata: {
          originalName: file.originalname,
        },
      });

      const uploadResult = await this.s3Client.send(command);

      return {
        url: (await this.getFileUrl(key)).url,
        key,
        // uploadResult,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.configService.get('s3BucketName'),
        Key: key,
      });

      await this.s3Client.send(command);
      return {
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string) {
    return {
      url: `https://${this.configService.get('s3BucketName')}.s3.amazonaws.com/${key}`,
    };
  }

  async removeImageBackground(file: Express.Multer.File) {
    // const apiKey = '35f69d0a-7680-49c0-baeb-5cbdf05e0b7e';
    const apiKey = this.configService.get('removeBgKey');
    if (!apiKey) {
      throw new InternalServerErrorException('API Key is missing');
    }

    try {
      // Gọi thư viện rembg để xử lý xóa nền
      const { base64Image, cleanup } = await rembg({
        apiKey,
        inputImage: file.buffer, // Sử dụng buffer trực tiếp
        returnBase64: true, // Yêu cầu trả về ảnh dưới dạng Base64
        onDownloadProgress: (progress) =>
          console.log('Download progress:', progress),
        onUploadProgress: (progress) =>
          console.log('Upload progress:', progress),
      });

      console.log(`✅🎉 Background removed`);

      const base64String = base64Image.slice(
        base64Image.toString().indexOf(','),
      );
      const originalName = 'image.png';
      return this.uploadBase64Image(base64String, originalName);

      // return base64Image; // Trả về ảnh đã xóa nền dưới dạng Base64
    } catch (error) {
      console.log(error);
      return false;
      throw new InternalServerErrorException(
        'Error removing background',
        error,
      );
    }
  }

  async uploadFoodImgNotBg(file: Express.Multer.File) {
    console.log(file);

    try {
      const key = `${uuid()}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('s3BucketName'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',

        Metadata: {
          originalName: encodeURIComponent(file.originalname),
        },
      });

      const uploadResult = await this.s3Client.send(command);

      return {
        url: (await this.getFileUrl(key)).url,
        key,
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Error uploading image to S3',
        error,
      );
    }
  }

  async uploadBase64Image(base64String: string, originalName: string) {
    try {
      // Giải mã Base64 thành Buffer
      const buffer = Buffer.from(base64String, 'base64');

      // Tạo một key cho file trên S3
      const key = `uploads/${Date.now()}_${originalName}`;

      const command = new PutObjectCommand({
        Bucket: this.configService.get('s3BucketName'),
        Key: key,
        Body: buffer,
        ContentType: 'image/png/jpg', // Hoặc kiểu hình ảnh tương ứng
        ACL: 'public-read',
      });

      await this.s3Client.send(command);

      return {
        url: (await this.getFileUrl(key)).url,
        key,
        // uploadResult,
      };
      // Trả về URL của file đã lưu
      // return `https://${this.configService.get('s3BucketName')}.s3.amazonaws.com/${key}`;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error uploading image to S3',
        error,
      );
    }
  }
}
