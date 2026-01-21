import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // เปิด CORS
  app.enableCors();

  // Serve static files - สำหรับแสดงรูปภาพจาก /uploads folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // เปิดใช้ ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัด field แปลกปลอมทิ้งอัตโนมัติ
    forbidNonWhitelisted: true, // แจ้ง Error ถ้ามี field แปลกปลอม
    transform: true, // แปลง payload เป็น class ตาม DTO
    transformOptions: { enableImplicitConversion: true },
  }));

  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}
bootstrap();