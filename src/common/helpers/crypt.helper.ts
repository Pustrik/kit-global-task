import * as bcrypt from 'bcrypt';

export async function hashString(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function compareStrings(
  hash: string,
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
