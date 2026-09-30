export function mongoUri(): string {
  const value =
    process.env.MONGODB_URI ||
    'mongodb://127.0.0.1:27018/betazed?replicaSet=offline-rs';
  const uri = new URL(value);
  if (
    uri.protocol !== 'mongodb:' ||
    !['localhost', '127.0.0.1'].includes(uri.hostname)
  )
    throw new Error(
      'Offline MongoDB requires a single localhost mongodb:// address',
    );
  return value;
}
export function jwtSecret(): string {
  if (!process.env.JWT_SECRET)
    throw new Error('JWT_SECRET is required; load .env.local');
  return process.env.JWT_SECRET;
}
