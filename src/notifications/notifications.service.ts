import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationService {
  constructor(private userService: UsersService) {}

  async sendLowStockNotification(product: {
    name: string;
    totalQuantity: number;
  }) {
    const title = 'Stock bajo';
    const body = `El producto ${product.name} tiene un stock de ${product.totalQuantity}`;
    await this.sendToAllUsers(title, body);
  }

  async sendPushNotification(token: string, title: string, body: string) {
    try {
      fetch(process.env.EXPO_PUSH_NOTIFICATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          title,
          body,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error:', error));
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }

  async sendToAllUsers(title: string, body: string) {
    const users = await this.userService.getAllUsersWithToken();
    await Promise.all(
      users.map((user) => this.sendPushNotification(user.token, title, body)),
    );
  }
}
