import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash} from 'crypto'

const algorithm = 'aes-256-cbc';

const deriveKeyAndIV = (password: string): {
    key: Buffer,
    iv: Buffer
} => {
  const key = scryptSync(password, 'salt', 32);

  const hash = createHash('sha256');
  hash.update(password);
  const iv = hash.digest().slice(0, 16); 
  return { key, iv };
};

export const encrypt = (data: any, password: string) => {
  const { key, iv } = deriveKeyAndIV(password);

  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

export const decrypt = (encryptedData: any, password: string) => {
  const { key, iv } = deriveKeyAndIV(password);

  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

