import { IsEmail, IsString, Length } from 'class-validator'

export class AuthDTO {
  @IsEmail(undefined, {
    message: 'Por favor digite um email válido',
  })
  email!: string

  @IsString({
    message: 'A senha é obrigatória',
  })
  @Length(6, 20, {
    message: `Senha deve conter o mínimo de 6 e máximo de 20 caracteres`,
  })
  password!: string
}
