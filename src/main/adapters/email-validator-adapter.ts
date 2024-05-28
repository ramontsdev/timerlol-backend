import { IEmailValidator } from '../../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/.test(email)
  }
}
