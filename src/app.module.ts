import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { PlanModule } from "./plan/plan.module";
import { Plan } from "./plan/entities/plan.entity";
import { LlmService } from "./llm/llm.service";
import { LlmController } from "./llm/llm.controller";
import { LlmModule } from "./llm/llm.module";
import { HttpModule, HttpService } from "@nestjs/axios";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { NotificationModule } from "./notification/notiffication.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "src", "assets", "generated_image"),
      serveRoot: "/generated-images",
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Plan],
      synchronize: true,
    }),
    PlanModule,
    LlmModule,
    HttpModule,
    AuthModule,
    NotificationModule,
  ],
  providers: [LlmService],
  controllers: [LlmController],
})
export class AppModule {}
