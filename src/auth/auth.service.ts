import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signUp() {
    return { msg: 'I have signed up' };
  }
  signIn() {
    return 'I am signing in';
  }
}
