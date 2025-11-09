import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function registerUser(username: string, password: string) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { username, password: hashed },
  });
}

export async function verifyUser(username: string, password: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.password);
  return match ? user : null;
}
