import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CryptoService } from 'src/providers/crypto.service';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/providers/aws.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CryptoService, ConfigService, AwsService],
})
export class UsersModule {}
