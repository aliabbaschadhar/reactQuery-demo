import axios from "axios";
import type { Todo } from "../types/todo";

const BASE_URL = "https://jsonplaceholder.typicode.com/";
const axiosInstance = axios.create({ baseURL: BASE_URL });


export const getTodosIds = async () => {
  return (await axiosInstance.get<Todo[]>('todos')).data.map((todo) => todo.id)
}

export const getTodo = async (id: number) => {
  return (await axiosInstance.get<Todo>(`todos/${id}`)).data;
}