import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: { durable: true },
    },
  });
  app.enableCors({
    origin: true, // or specify your frontend URL: ['http://localhost:3000']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // Important for cookies/sessions
    exposedHeaders: 'Authorization', // Needed for SSE with auth headers
  })
  await app.startAllMicroservices(); // For RabbitMQ
  console.log('running on port', process.env.PORT ?? 3001);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
