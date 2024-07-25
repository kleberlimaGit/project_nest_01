import { User } from '@prisma/client'
import { IsString, IsEmail, Length } from 'class-validator'

export class UserAccountDTO {
  id?: number
  @IsString({
    message: 'Por favor digite um nome válido',
  })
  name!: string

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

  constructor() {}

  static convert(user: User): UserAccountDTO {
    const userDTO = new UserAccountDTO()
    userDTO.id = user.id
    userDTO.name = user.name
    userDTO.email = user.email
    return userDTO
  }
}
