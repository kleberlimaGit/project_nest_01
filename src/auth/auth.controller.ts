import { Body, Controller, Post, BadRequestException } from '@nestjs/common'
import { hash as _hash } from 'bcryptjs'
import { UserAccountDTO } from 'src/dtos/UserAccountDTO'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('auth')
export class AuthController {
  constructor(private prismaService: PrismaService) {}

  @Post('/create')
  async createAccount(@Body() body: UserAccountDTO) {
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

  @Post('/login')
  login() {}
}
