import axios from "axios";
import { error } from "console";
import { useEffect, useState } from "react";

// Add a concrete type for the items
interface Todo {
  id: number;
  title: string;
  // userId?: number;
  // completed?: boolean;
}

function App() {
  const [data, setData] = useState<Todo[] | null>(null);
  useEffect(() => {
    axios.get<Todo[]>("https://jsonplaceholder.typicode.com/todos")
      .then((response) => {
        console.log(response)
        setData(response.data);
      })
      .catch((err) => console.error("error occurred while fetching todos: " + err))
    return () => {
      setData(null); // Cleanup function to reset data
    }
  }, [])
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <ul>
        {data?.map((item: Todo) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
