import Cryptr from 'cryptr';


export function encrypt(data: string, encryptionKey: string): string {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.encrypt(data);
}



export function decrypt(encryptedData: string, encryptionKey: string): string {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.decrypt(encryptedData);
}