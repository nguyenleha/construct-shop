import { genSaltSync, hashSync } from 'bcryptjs';
export function getHashPassword(password: string) {
  const salt = genSaltSync(10); 
  return hashSync(password, salt); 
}
