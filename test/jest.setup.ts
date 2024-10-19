import * as dotenv from 'dotenv';
import { User } from 'src/users/user.entity';

export default async function setup() {
  dotenv.config({
    path: '.env.test',
  });

  await User.delete({});
}
