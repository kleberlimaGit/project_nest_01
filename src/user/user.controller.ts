import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { UserAccountDTO } from 'src/dtos/UserAccountDTO'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash as _hash } from 'bcryptjs'

@Controller('users')
export class UserController {
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
}
