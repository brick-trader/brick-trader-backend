import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { promisify } from "util";
import { exec } from "child_process";

async function bootstrap() {
  if (process.env.NODE_ENV === "production") {
    const promisifiedExec = promisify(exec);
    await promisifiedExec("pnpm prisma migrate deploy");
  }
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000, "0.0.0.0");
}
bootstrap();
