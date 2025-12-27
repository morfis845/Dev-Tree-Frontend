export type User = {
  handle: string;
  name: string;
  email: string;
  description: string;
  image: string;
  links: string;
};

export type RegisterUser = Pick<User, "name" | "email" | "handle"> & {
  password: string;
  password_confirmation: string;
};

export type LoginUser = Pick<User, "email"> & {
  password: string;
};

export type UserHandle = Pick<
  User,
  "handle" | "name" | "image" | "description" | "links"
>;

export type ProfileUpdate = Pick<User, "handle" | "description">;

export type SocialLink = {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
};

export type DevTreeLink = Pick<SocialLink, "name" | "url" | "enabled">;
