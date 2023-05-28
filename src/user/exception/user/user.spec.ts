import { UserException } from './user';

describe('PetsException', () => {
  it('should be defined', () => {
    expect(new UserException()).toBeDefined();
  });
});
