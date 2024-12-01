import { Module } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
