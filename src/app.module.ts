import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { QuestionModule } from './question/question.module'
@Module({
  imports: [AuthModule, UserModule, QuestionModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
