import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './user';

export class UpdateUser extends PartialType(UserDto) {
    id: string;
    name: string;
    email: string;
    location: string;
    phone: string;
}