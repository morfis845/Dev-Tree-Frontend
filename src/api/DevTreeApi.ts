import { api } from "@/config/axios";
import type { ProfileUpdate, User } from "@/types";
import { isAxiosError } from "axios";

export async function getUser() {
  try {
    const { data } = await api.get<User>("/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}

interface UpdateUserResponse {
  message: string;
  user: User;
}

export async function updateUser(formData: ProfileUpdate) {
  try {
    const response = await api.patch<UpdateUserResponse>("/user", formData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
