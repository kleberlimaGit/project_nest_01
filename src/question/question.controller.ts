import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UserPayload } from 'src/auth/jwt.strategy'
import { QuestionDTO } from 'src/dtos/QuestionDTO'
import { PrismaService } from 'src/prisma/prisma.service'
import { CurrentUser } from 'src/user/decorators/current-user-decorators'
import { createPaginator } from 'prisma-pagination'
import { PaginatedOutputDto } from 'src/dtos/PaginatedOutputDto'
import { Prisma } from '@prisma/client'

@Controller('questions')
@UseGuards(AuthGuard('jwt'))
export class QuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async createQuestion(
    @Body() questionDTO: QuestionDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const question = await this.prismaService.question
      .create({
        data: {
          content: questionDTO.content,
          title: questionDTO.title,
          slug: this.stringToSlug(questionDTO.title),
          authorId: user.sub,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException(
          'Ocorreu algum erro ao tentar fazer sua pergunta.',
        )
      })

    return { question }
  }

  @Get()
  async getQuestion(
    @CurrentUser() user: UserPayload,
    @Query('page') page: number = 1,
    @Query('perPage') perPage: number = 10,
  ): Promise<PaginatedOutputDto<QuestionDTO>> {
    const paginate = createPaginator({ perPage })

    return paginate<QuestionDTO, Prisma.QuestionFindManyArgs>(
      this.prismaService.question,
      {
        where: {
          authorId: user.sub,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      {
        page,
      },
    )
  }

  @Get('/:id')
  async getQuestionById(
    @CurrentUser() user: UserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const question = await this.prismaService.question.findFirst({
      where: {
        id,
        authorId: user.sub,
      },
    })

    if (!question) {
      throw new NotFoundException(`Pergunta com id: ${id} não encontrada`)
    }

    return question
  }

  private stringToSlug(title: string): string {
    return title
      .normalize('NFD') // Normalize the string to separate diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/ç/g, 'c') // Replace ç with c
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
      .trim() // Trim leading and trailing spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase() // Convert to lowercase
  }
}
