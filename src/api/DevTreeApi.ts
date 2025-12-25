import { api } from "@/config/axios";
import type { User } from "@/types";
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

interface UploadImageResponse {
  message: string;
  image: string;
}

export async function updateUser(formData: User) {
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

export async function uploadImage(file: File) {
  let formData = new FormData();
  formData.append("file", file);
  try {
    const response = await api.post<UploadImageResponse>(
      "/user/image",
      formData
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
}
