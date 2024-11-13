import {
  Body,
  ConflictException,
  Controller,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly cryptoService: CryptoService,
  ) {}

  private async validateUser(userDto: CreateUserDto) {
    const { mail, user } = userDto;
    const conflictingUser = await this.userService.findUnique(user, mail);
    if (conflictingUser) {
      const conflictingField = conflictingUser.mail === mail ? 'mail' : 'user';
      const fieldNamesByfield = {
        mail: 'mail',
        user: 'usuario',
      };
      throw new ConflictException({
        field: conflictingField,
        message: `El ${fieldNamesByfield[conflictingField]} ya está registrado.`,
      });
    }
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    await this.validateUser(createUserDto);
    const createdUser = await this.userService.create(createUserDto);
    const { hashedPassword, ...user } = createdUser;
    return user;
  }

  @Put('/password')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const authorization = request.headers['authorization'];
    const payload = this.cryptoService.verifyToken(authorization);
    return this.userService.changePassword(payload.id, changePasswordDto);
  }

  @Put()
  public async editUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    const authorization = request.headers['authorization'];
    const payload = this.cryptoService.verifyToken(authorization);
    return this.userService.editUser(payload.id, updateUserDto);
  }

  @Post('/login')
  public async loginUser(@Body() { user, password }: LoginUserDto) {
    return await this.userService.login(user, password);
  }
}
