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
