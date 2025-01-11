"use server";

const PASSWORD = process.env.ADMIN_PASSWORD!;

export const checkPassword = async (password: string) => {
  if (password === PASSWORD) {
    return true;
  }

  return false;
};
