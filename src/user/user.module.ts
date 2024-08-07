import { Module } from '@nestjs/common'
import { JwtStrategy } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserController } from './user.controller'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, JwtStrategy],
})
export class UserModule {}
