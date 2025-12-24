import { api } from "@/config/axios";
import { isAxiosError } from "axios";

export async function getUser() {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
}
