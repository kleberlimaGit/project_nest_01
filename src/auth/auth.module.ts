import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      privateKey: Buffer.from(process.env.JWT_PRIVATE_KEY!, 'base64'),
      publicKey: Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64'),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1H',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService],
})
export class AuthModule {}
