import jwt from 'jsonwebtoken';

import { IDecrypter } from '../../domain/use-cases/cryptography/decrypter';
import { IEncrypter } from '../../domain/use-cases/cryptography/encrypter';

export class JwtAdapter implements IEncrypter, IDecrypter {
  encrypt(value: string): string {
    return jwt.sign({ sub: value }, process.env.JWT_SECRET!, {
      expiresIn: '5d',
    });
  }

  decrypt(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    } catch {
      return null;
    }
  }
}
