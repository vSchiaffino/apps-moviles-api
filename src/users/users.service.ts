import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class UsersService {
  constructor(private readonly cryptoService: CryptoService) {}

  public async login(user: string, password: string) {
    const findedUser = await User.findOne({
      where: {
        user,
      },
    });
    if (
      !findedUser ||
      !(await this.cryptoService.verify(password, findedUser.hashedPassword))
    )
      throw new BadRequestException({
        message: 'Credenciales inválidas',
      });

    const { hashedPassword, ...payload } = findedUser;
    return {
      token: this.cryptoService.sign(payload),
    };
  }

  public async findUnique(user: string, mail: string) {
    return User.createQueryBuilder('user')
      .where('user.user = :user', { user })
      .orWhere('user.mail = :mail', { mail })
      .getOne();
  }

  public async create({ user, mail, name, lastName, password }: CreateUserDto) {
    return User.save({
      mail,
      name,
      lastName,
      hashedPassword: await this.cryptoService.hash(password),
      user,
    });
  }
}
