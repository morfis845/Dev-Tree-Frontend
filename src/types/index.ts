export type User = {
  handle: string;
  name: string;
  email: string;
  description: string;
  image: string;
};

export type RegisterUser = Pick<User, "name" | "email" | "handle"> & {
  password: string;
  password_confirmation: string;
};

export type LoginUser = Pick<User, "email"> & {
  password: string;
};

export type ProfileUpdate = Pick<User, "handle" | "description">;
