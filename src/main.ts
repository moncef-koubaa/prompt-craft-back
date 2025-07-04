import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: "*",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
