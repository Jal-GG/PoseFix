const ALGORITHM = 'aes-256-gcm';

function getKey(): Promise<CryptoKey> {
  const secret = process.env.LANDMARK_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) {
    throw new Error('LANDMARK_ENCRYPTION_KEY must be at least 32 characters');
  }
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret).slice(0, 32);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: ALGORITHM },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encrypt(data: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(data),
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return Buffer.from(combined.buffer).toString('base64');
}

export async function decrypt(encryptedBase64: string): Promise<string> {
  const key = await getKey();
  const combined = new Uint8Array(Buffer.from(encryptedBase64, 'base64'));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, data);
  return new TextDecoder().decode(decrypted);
}
