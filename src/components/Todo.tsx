import { useTodoIds, useTodos } from "../utils/queries";

export default function Todo() {
  const todosIdsQuery = useTodoIds();
  // const isFetching = useIsFetching();
  const todoQueries = useTodos(todosIdsQuery.data);

  if (todosIdsQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (todosIdsQuery.isError) {
    console.error("Error occurred...");
    return <div>Error occurred...</div>;
  }

  return (
    <>
      {/* <p>Query function status: {todosIdsQuery.status}</p> ==> Will check the status of the query function */}
      {/* <p>Query data Status: {todosIdsQuery.status}</p> ==> Will check the status of the query data */}
      {/* <p>Global fetching: {isFetching}</p> ==> Will check if any query is currently fetching */}

      {todosIdsQuery.data?.map((id) => (
        <div key={id}>Todo ID: {id}</div>
      ))}

      <ul>
        {todoQueries.map(({ data }) => (
          <li key={data?.id}>
            <div> id: {data?.id}</div>
            <span>
              <strong>Title:</strong> {data?.title},{" "}
              <strong>Completed: </strong> {data?.completed},{" "}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
