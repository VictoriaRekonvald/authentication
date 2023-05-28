import { PartialType } from '@nestjs/swagger';
import { CreateAuthenticationDto } from './authentication-create.dto';

export class UpdateAuthenticationDto extends PartialType(
  CreateAuthenticationDto,
) {}
