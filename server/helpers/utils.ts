import * as bcrypt from 'bcrypt';

// * Uncomment for logs
// import { Logger } from '@nestjs/common';
// const logger = new Logger('comparePasswords');

export const comparePasswords = async (
  userPassword: string,
  currentPassword: string,
): Promise<boolean> => {
  const match = await bcrypt.compare(currentPassword, userPassword);

  // * Logging the boolean result of the password comparison
  // logger.debug(`Password comparison result: ${match}`);
  return match;
};
