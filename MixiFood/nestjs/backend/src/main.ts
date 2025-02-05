import { NestFactory } from '@nestjs/core';
import { Appmodule } from './app.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { env } from 'process';
import * as fs from 'fs'; // Import fs để đọc tệp
import path from 'path';

async function start(): Promise<void> {
  // const httpsOptions = {
  //   key: fs.readFileSync('/etc/letsencrypt/live/mixiapp.online/privkey.pem'), // Đường dẫn đến khóa riêng
  //   cert: fs.readFileSync('/etc/letsencrypt/live/mixiapp.online/fullchain.pem'), // Đường dẫn đến chứng chỉ
  // };
  const keyPath = '/etc/letsencrypt/live/mixiapp.online/privkey.pem';
  const certPath = '/etc/letsencrypt/live/mixiapp.online/fullchain.pem';

  const httpsOptions =
    fs.existsSync(keyPath) && fs.existsSync(certPath)
      ? {
          key: fs.readFileSync(keyPath), // Đường dẫn đến khóa riêng
          cert: fs.readFileSync(certPath), // Đường dẫn đến chứng chỉ
        }
      : undefined;

  const app = await NestFactory.create(Appmodule, {
    httpsOptions,
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(configService.get('port'), () => {
    console.log(`listener on Port: `, configService.get('PORT'));
  });
}

start();
