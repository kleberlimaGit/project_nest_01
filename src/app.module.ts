import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { UserController } from './user/user.controller'
@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService],
})
export class AppModule {}
