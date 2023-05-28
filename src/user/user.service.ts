import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user/user';
import { UpdateUser } from './dto/user/update-user';
import { UserException } from './exception/user/user';

@Injectable()
export class UserService {
  private users: UserDto[] = [];

  findAll(): UserDto[] {
    return this.users;
  }

  create(user: UserDto): UserDto {
    const createdUser = { ...user, id: this.generateId() };
    this.users.push(createdUser);
    return createdUser;
  }

  update(id: string, updateUser: UpdateUser): UserDto {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      throw new UserException("No such id exists");
    }
    const updatedUser = { ...this.users[userIndex], ...updateUser, id };
    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: string): void {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex < 0) {
      throw new UserException("No such id exists");
    }
    this.users.splice(userIndex, 1);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
