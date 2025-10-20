import { useTodoIds } from "../utils/queries";

export default function Todo() {
  const todoIdsQuery = useTodoIds();

  if (todoIdsQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (todoIdsQuery.isError) {
    return <div>Error: {todoIdsQuery.error.message}</div>;
  }

  return (
    <>
      {todoIdsQuery.data?.map((id) => (
        <div key={id}>Todo ID: {id}</div>
      ))}
    </>
  );
}
