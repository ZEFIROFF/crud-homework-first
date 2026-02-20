import { UserRepository } from './user.repository';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
};

describe('UserRepository', () => {
  let userRepository: UserRepository;
  beforeEach(() => {
    userRepository = new UserRepository(mockPrisma as never);
  });
  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });
});
