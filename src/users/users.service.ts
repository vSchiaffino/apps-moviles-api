/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CryptoService } from 'src/providers/crypto.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AwsService } from 'src/providers/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly awsService: AwsService,
  ) {}

  async changeProfilePicture(id: number, file: Express.Multer.File) {
    const url = await this.awsService.uploadImage(file);
    await User.update(id, { profilePictureUrl: url });
    const user = await User.findOneBy({ id });
    const { hashedPassword, ...rest } = user;
    return rest;
  }

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
      throw new UnauthorizedException({
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
    const newUser = await User.save({
      mail,
      name,
      lastName,
      hashedPassword: await this.cryptoService.hash(password),
      user,
    });
  
    const { hashedPassword, ...payload } = newUser;
    const token = this.cryptoService.sign(payload);
    return { token: token };
  }

  public async editUser(id: number, updateUserDto: UpdateUserDto) {
    delete updateUserDto.password;
    await User.update(id, updateUserDto);
    const user = await User.findOneBy({ id });
    delete user.hashedPassword;
    return user;
  }

  public async changePassword(
    id: number,
    { password, newPassword }: ChangePasswordDto,
  ) {
    const user = await User.findOneBy({ id });
    const isPasswordValid = await this.cryptoService.verify(
      password,
      user.hashedPassword,
    );
    if (!isPasswordValid)
      throw new BadRequestException({
        message: 'Contraseña inválida',
      });
    await User.update(id, {
      hashedPassword: await this.cryptoService.hash(newPassword),
    });
    return {
      message: 'Ok',
    };
  }
}
