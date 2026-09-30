import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { mongoUri } from './offline-config';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: mongoUri(), serverSelectionTimeoutMS: 5000 }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
