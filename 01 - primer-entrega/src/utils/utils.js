import { compare, genSalt, hash } from "bcrypt";

export const dirname = process.cwd();

/**
 * Hashing method using bcrypt library
 * @param {*} password string (plain password)
 * @returns string (hasshed password)
 */
export const createHash = async (password) => hash(password, await genSalt(10));

/**
 * Hashing comparison method using bcrypt library
 * @param {*} password string (plain password)
 * @param {*} hashedPassword string (hashed password)
 * @returns boolean (true if they are the same after hashing)
 */
export const isValidPassword = async (password, hashedPassword) =>
  compare(password, hashedPassword);
