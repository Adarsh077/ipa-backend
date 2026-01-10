import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { InsurancesModule } from './insurances/insurances.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
        onConnectionCreate: (connection) => {
          connection.on('connected', () =>
            console.log('connected to mongodb...'),
          );
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    InsurancesModule,
    FilesModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
