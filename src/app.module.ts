import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
	imports: [
		UsersModule,
		AuthModule,
		ConfigModule.forRoot(),
		MongooseModule.forRoot(process.env.MONGODB_CONNECTION, { dbName: process.env.MONGODB_NAME }),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
