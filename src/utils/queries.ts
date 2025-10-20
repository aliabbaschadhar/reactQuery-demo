import { useQuery } from "@tanstack/react-query";
import { getTodosIds } from "./api";

export function useTodoIds() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodosIds,
  });
}