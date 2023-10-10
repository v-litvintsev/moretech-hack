import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3001;

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    await app.listen(PORT, () => {
      console.log(`Web app started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

bootstrap();
