import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { UserAccountDTO } from 'src/dtos/UserAccountDTO'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash as _hash } from 'bcryptjs'
import { AuthGuard } from '@nestjs/passport'
import { UserPayload } from 'src/auth/jwt.strategy'
import { CurrentUser } from './decorators/current-user-decorators'

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private prismaService: PrismaService) {}

  @Post('/create')
  async createAccount(
    @Body() body: UserAccountDTO,
    @CurrentUser() userLogged: UserPayload,
  ) {
    console.log(userLogged.sub)
    const findUserByEmail = await this.prismaService.user.findFirst({
      where: {
        email: body.email,
      },
    })

    if (findUserByEmail) {
      throw new BadRequestException('E-mail já utilizado.')
    }
    const hash = await _hash(body.password, 8)
    const user = await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hash,
      },
    })

    return UserAccountDTO.convert(user)
  }
}
