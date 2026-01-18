// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิดใช้ ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัด field แปลกปลอมทิ้งอัตโนมัติ
    forbidNonWhitelisted: false, // ปิดการแจ้ง Error สำหรับ field แปลกปลอม
    transform: true, // แปลง type ของข้อมูล
    transformOptions: { enableImplicitConversion: true }
  }));

  await app.listen(3000);
}
bootstrap();
