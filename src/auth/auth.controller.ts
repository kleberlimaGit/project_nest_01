import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { AuthDTO } from 'src/dtos/AuthDTO'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post('/session')
  async getSession(@Body() auth: AuthDTO) {
    const { email, password } = auth

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não identificado.')
    }

    const isPassordValid = await compare(password, user.password)

    if (!isPassordValid) {
      throw new UnauthorizedException('Usuário não identificado.')
    }
    const accessToken = this.jwtService.sign({
      sub: user.id,
    })
    return { access_token: accessToken }
  }
}
