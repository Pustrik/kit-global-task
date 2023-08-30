import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default async (app) => {
  const config = new DocumentBuilder()
    .setTitle('kit-global')
    .setDescription('kit-global endpoints')
    .setVersion('1.0')
    .addTag('kit-kat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
