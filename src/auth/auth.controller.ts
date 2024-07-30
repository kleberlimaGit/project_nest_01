import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash as _hash, compare } from 'bcryptjs'
import { AuthDTO } from 'src/dtos/AuthDTO'
import { UserAccountDTO } from 'src/dtos/UserAccountDTO'
import { PrismaService } from 'src/prisma/prisma.service'

@Controller('auth')
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

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
