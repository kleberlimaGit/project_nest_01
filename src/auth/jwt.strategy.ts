import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

const tokenSchema = z.object({
  sub: z.number(),
})

export type UserPayload = z.infer<typeof tokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(process.env.JWT_PUBLIC_KEY!, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    return tokenSchema.parse(payload)
  }
}
