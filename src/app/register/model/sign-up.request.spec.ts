import { SignUpRequest } from './sign-up.request';

describe('SignUpRequest', () => {
  it('should create an instance', () => {
    expect(new SignUpRequest('testUsername', 'testPassword', ['USER'])).toBeTruthy();
  });
});