import { UserExceptionFilter } from './user.filter';

describe('UserFilter', () => {
  it('should be defined', () => {
    expect(new UserExceptionFilter()).toBeDefined();
  });
});
