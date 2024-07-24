import { Body, Controller, Post, BadRequestException } from '@nestjs/common'
import { hash as _hash } from 'bcryptjs'
import { UserAccountDTO } from 'src/dtos/UserAccountDTO'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('users')
export class UserController {
  constructor(private prismaService: PrismaService) {}

  @Post('/accounts')
  async createAccount(@Body() body: UserAccountDTO) {
    const findUserByEmail = await this.prismaService.user.findFirst({
      where: {
        email: body.email,
      },
    })

    if (findUserByEmail) {
      throw new BadRequestException('Email not allowed')
    }
    const hash = await _hash(body.password, 8)
    await this.prismaService.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hash,
      },
    })
  }
}
