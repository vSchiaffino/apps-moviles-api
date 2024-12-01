import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CryptoService } from 'src/providers/crypto.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
    return await this.userService.create(createUserDto);
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
  public async loginUser(@Body() dto: LoginUserDto) {
    return await this.userService.login(dto);
  }

  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  public async changeProfilePicture(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(
        'request should include the profile picture file',
      );
    const authorization = request.headers['authorization'];
    const payload = this.cryptoService.verifyToken(authorization);
    return this.userService.changeProfilePicture(payload.id, file);
  }
}
