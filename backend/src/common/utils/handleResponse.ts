import { genSaltSync, hashSync } from 'bcryptjs';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { deflateSync, inflateSync } from 'zlib';

export const handleResponseRemoveKey = (response: any) => {
  delete response.password;
  delete response.isActive;
  delete response.isDeleted;
  delete response.deleted_at;
  delete response.created_by;
  delete response.updated_by;
  delete response.refreshToken;
  return response;
};

export const handleResponseRemoveKeyList = (response: any) => {
  const data = response.map((rest) => handleResponseRemoveKey(rest));
  return data;
};
export function getHashPassword(password: string) {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

export function encryptValue(obj: object, secretKey: string): string {
  const text = JSON.stringify(obj);

  // Compress the JSON string
  const compressedText = deflateSync(text).toString('base64');

  const iv = randomBytes(16);
  const cipher = createCipheriv(
    'aes-256-ctr',
    Buffer.from(secretKey, 'hex'),
    iv,
  );

  let encrypted = cipher.update(compressedText, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Combine IV and encrypted text
  const encryptedResult = iv.toString('base64') + ':' + encrypted;
  return encryptedResult;
}

// Decrypt function with Base64 decoding
export function decryptValue(
  encryptedValue: string,
  secretKey: string,
): object {
  const [ivBase64, encryptedTextBase64] = encryptedValue.split(':');
  if (!ivBase64 || !encryptedTextBase64) {
    throw new Error('Invalid encrypted data format');
  }
  const iv = Buffer.from(ivBase64, 'base64');
  const key = Buffer.from(secretKey, 'hex');

  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  let decrypted = decipher.update(encryptedTextBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  // Decompress the JSON string
  const decompressedText = inflateSync(
    Buffer.from(decrypted, 'base64'),
  ).toString('utf8');

  const obj = JSON.parse(decompressedText);
  return obj;
}
