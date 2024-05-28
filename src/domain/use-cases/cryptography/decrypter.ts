export interface IDecrypter {
  decrypt(token: string): { sub: string } | null;
}
