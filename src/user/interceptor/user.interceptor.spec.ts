import { UserInterceptor } from './interceptor/user.interceptor';

describe('UserInterceptor', () => {
  it('should be defined', () => {
    expect(new UserInterceptor()).toBeDefined();
  });
});
