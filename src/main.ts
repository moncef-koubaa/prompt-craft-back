import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  // Start NestJS server on port 3000
  await app.listen(3000, () => {
    console.log(`NestJS server is running on http://localhost:3000`);
  });

}
bootstrap();
