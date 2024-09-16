import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Web Dev Lab')
		.setDescription('The Web Dev Lab API description')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('swagger/api', app, swaggerDocument);
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(3000);

	console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
