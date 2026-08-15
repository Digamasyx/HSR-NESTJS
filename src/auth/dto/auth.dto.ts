import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {
  @ApiProperty({
    type: String,
    description: 'Nome de usuário ou identificador de acesso',
    example: 'admin',
  })
  name: string;

  @ApiProperty({
    type: String,
    format: 'password',
    description: 'Senha do usuário',
    example: 'Abc12345!',
  })
  pass: string;
}
