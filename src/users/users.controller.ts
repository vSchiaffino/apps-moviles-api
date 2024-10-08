import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  private async validateUser(userDto: CreateUserDto) {
    const { mail, user } = userDto;
    const conflictingUser = await this.userService.findUnique(user, mail);
    if (conflictingUser) {
      const conflictingField = conflictingUser.mail === mail ? 'mail' : 'user';
      const fieldNamesByfield = {
        mail: 'mail',
        user: 'usuario',
      };
      throw new BadRequestException({
        field: conflictingField,
        message: `El ${fieldNamesByfield[conflictingField]} ya está registrado.`,
      });
    }
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    await this.validateUser(createUserDto);
    return await this.userService.create(createUserDto);
  }

  @Post('/login')
  public async loginUser(@Body() { user, password }: LoginUserDto) {
    return await this.userService.login(user, password);
  }
}
