import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ParsePaginationRequestPipe } from './pagination/parse-pagination-request.pipe';
import { ParseSortingRequestPipe } from './sorting/sorting-request.pipe';
import { equalsIgnoreCase } from './string/equals-ignore-case';
import config from './config';

function useSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Marketplace api')
    .setDescription('')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/index.html', app, document);
}

function useGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(new ParsePaginationRequestPipe());
  app.useGlobalPipes(new ParseSortingRequestPipe());
}

function ignoreQueryCase(app: INestApplication) {
  app.use((req: any, res: any, next: any) => {
    req.query = new Proxy(req.query, {
      get: (target, name) => target[Object.keys(target)
        .find(key => equalsIgnoreCase(key, name.toString())) ?? name]
    })

    next();
  });}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  useSwagger(app);
  ignoreQueryCase(app);
  useGlobalPipes(app);

  await app.listen(config.listenPort);
}
bootstrap();
