import { IsString, Length } from 'class-validator'
const min = 5
const max = 50
export class QuestionDTO {
  @IsString({
    message: 'Titulo deve ser informado.',
  })
  @Length(min, max, {
    message: `Títuo deve ter no mínimo ${min} caracteres e no máximo ${max}`,
  })
  title!: string

  @IsString({
    message: 'Conteúdo é obrigatório',
  })
  content!: string
}
