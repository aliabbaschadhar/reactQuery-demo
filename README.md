# 🌀 React Query (TanStack Query) — Complete Project Guide with Bun, Vite, TypeScript & TailwindCSS

## 📖 Part 1 — Introduction & Fundamentals

In this part, we’ll cover **why React Query exists**, how it compares to traditional data fetching, and the difference between **client state** and **server state**.

---

## 💡 What Problem Does React Query Solve?

Fetching, caching, and updating data from a server is one of the trickiest parts of building React apps. Traditionally, we manage this with `useEffect` and `useState`:

```tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/todos')
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

| Issue                           | Explanation                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| **Manual caching**              | Data is refetched every time the component mounts unless you implement caching yourself. |
| **No automatic refetch**        | Changes on the server aren’t automatically reflected.                                    |
| **Error handling**              | Each request needs manual `try/catch` or `.catch()`                                     |
| **State management overhead**   | Mixing server state with UI state can become messy.                                      |
| **Optimistic updates are hard** | Updating UI before the server responds requires custom logic.                            |

- React Query solves all of these by centralizing server state management and giving us hooks that handle caching, refetching, and mutations automatically.

---

## 🧩 Server State vs Client State

Before diving deeper, understand the distinction:

| Type of State    | Where It Lives      | Examples                                        |
| ---------------- | ------------------- | ----------------------------------------------- |
| **Client State** | Local to your UI    | Form inputs, toggle switches, local modal state |
| **Server State** | Fetched from an API | Todos, user profiles, messages                  |

Key differences:

- Server state is shared across components, can change outside your app, and often requires caching and refetching logic.
- Client state is local and predictable, managed with useState, useReducer, or Zustand/Redux.

React Query focuses exclusively on server state, solving the common pain points of fetching, caching, and syncing it with the UI.

---

| Feature               | Traditional `useEffect` | React Query                                     |
| --------------------- | ----------------------- | ----------------------------------------------- |
| Data fetching         | Manual `useEffect`      | `useQuery` hook handles fetching                |
| Caching               | You implement yourself  | Built-in intelligent caching                    |
| Background updates    | Manual                  | Automatic refetch on window focus / reconnect   |
| Mutations             | Manual state updates    | `useMutation` with optimistic updates           |
| Error handling        | Manual                  | Built-in error state                            |
| Stale data management | Manual                  | Configurable stale times and cache invalidation |

---

## Example with React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

function Todos() {
  const { data, isLoading, error } = useQuery(['todos'], async () => {
    const res = await axios.get('https://jsonplaceholder.typicode.com/todos');
    return res.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

- Notice how:

  - No useEffect is needed.
  - Caching is automatic.
  - Loading & error states are handled by React Query.
  - Data updates automatically when needed.

---

## ✅ Key Takeaways from Part 1

- React Query manages server state, reducing boilerplate.
- It handles caching, background refetching, error handling, and optimistic updates.
- Server state is different from client state — know when to use each.
- Traditional useEffect + useState works but requires manual handling of common patterns.
- React Query lets you focus on the UI and business logic, not the plumbing of data fetching.

---

## 📖 Part 2 — Project Setup

In this part, we’ll set up the development environment, install dependencies, and create a clean folder structure for our To-Do app.

---

## 🛠 Environment Setup

We will use the following stack:

- **Bun** — package manager & runtime
- **Vite + React + TypeScript** — frontend framework
- **TailwindCSS** — utility-first CSS framework
- **Axios** — for HTTP requests
- **TanStack React Query (v5)** — server state management

### 1. Initialize Vite Project with Bun

```bash
bun create vite react-query-todo --template react-ts
cd react-query-todo

bun install

bun add @tanstack/react-query axios
bun add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
@import 'tailwindcss';
```

---

## 🗂 Folder Structure

A clean folder structure helps in scaling the app:

```
react-query-todo/
├─ public/
├─ src/
│  ├─ api/           # Axios API calls
│  ├─ components/    # Reusable UI components
│  ├─ hooks/         # Custom hooks (e.g., useTodos)
│  ├─ pages/         # Page-level components
│  ├─ App.tsx
│  ├─ index.tsx
│  └─ index.css
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

---

## 1. Axios Instance

### Create src/api/axios.ts

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## 📖 Part 3 — QueryClient Setup

In this part, we’ll configure **React Query’s QueryClient**, which is the centralized state manager for all server state. This setup allows **caching, background refetching, and global configuration**.

---

## 🧩 Why QueryClient is Centralized

React Query uses a **single QueryClient instance** to manage all queries and mutations in your app. Benefits:

- **Centralized caching**: Multiple components can share the same data.
- **Global configuration**: Set default stale times, retry behavior, and refetch intervals.
- **DevTools integration**: Inspect queries and mutations in development.
- **Predictable updates**: Mutations automatically update related queries.

---

## 🔧 Setting Up QueryClientProvider

1. Install React Query DevTools (optional but helpful):

```bash
bun add @tanstack/react-query-devtools
```

---

## 2. Wrap your app with `QueryClientProvider` in `src/main.tsx`

```tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import TodosPage from './pages/TodosPage';

// Create a single QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodosPage />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

---

## 🔹 Default QueryClient Options

You can configure global defaults:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      cacheTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

| Option                 | Description                                                         |
| ---------------------- | ------------------------------------------------------------------- |
| `staleTime`            | How long data is considered fresh before refetching.                |
| `cacheTime`            | How long unused data stays in memory before garbage collection.     |
| `refetchOnWindowFocus` | Refetch queries when the window gains focus.                        |
| `retry`                | Number of automatic retry attempts for failed queries or mutations. |

These defaults save you from repetitive configurations in every `useQuery` or `useMutation`.

---

## ✅ Key Takeaways from Part 3

- QueryClient is the core of React Query, centralizing server state management.
- QueryClientProvider wraps the app and makes the client available everywhere.
- Default options allow global caching, stale time, retries, and refetch behaviors.
- React Query DevTools help visualize caching, refetching, and mutation updates.

---

## 📖 Part 4 — Fetching Todos (useQuery)

In this part, we’ll learn how to fetch data from the server using React Query’s `useQuery` hook, understand **query keys**, and see how caching works automatically.

---

## 🔹 Writing the Query Function

We will create a reusable function to fetch todos from our API.

Create `src/api/todos.ts`:

```ts
import { api } from './axios';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await api.get('/todos');
  return response.data;
};
```

Explanation:

- fetchTodos is a simple async function that returns an array of todos.
- Keeping API functions separate makes code modular and testable.

---

## 🔹 Using useQuery

Create src/pages/TodosPage.tsx:

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTodos, Todo } from '../api/todos';

function TodosPage() {
  const { data: todos, isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'], // unique key for this query
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul className="space-y-2">
        {todos?.map((todo) => (
          <li key={todo.id} className="p-2 border rounded flex justify-between">
            <span>{todo.title}</span>
            <span>{todo.completed ? '✅' : '❌'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodosPage;
```

Explanation:

- useQuery automatically fetches data and caches it.
- queryKey is a unique identifier for this query — React Query uses it to manage caching.
- isLoading and error provide built-in loading and error states.
- data is the fetched result (todos in this case).

---

## 🔹 Understanding queryKey and Caching

- queryKey: Can be a string or array, e.g., `['todos']` or `['todos', userId]`.
  - Helps React Query differentiate queries.
  - Changing the key triggers a refetch.
- Caching:
  - Data is automatically cached and shared across components.
  - If another component uses the same queryKey, it will use cached data.
  - Cache is updated automatically when data changes or a mutation occurs.

---

| Feature        | Traditional useEffect | React Query (`useQuery`)            |
| -------------- | --------------------- | ----------------------------------- |
| Caching        | Manual                | Automatic                           |
| Loading state  | Manual                | Built-in (`isLoading`)              |
| Error handling | Manual                | Built-in (`error`)                  |
| Refetching     | Manual                | Automatic on window focus/reconnect |
| Shared state   | Manual                | Shared across components            |

---

## ✅ Key Takeaways from Part 4

- useQuery simplifies fetching and caching data.
- queryKey uniquely identifies queries and allows automatic cache sharing.
- Built-in loading and error states reduce boilerplate.
- Data is automatically refetched when needed, keeping UI consistent.
- API functions should be modular and separate from components.

---

## 📖 Part 5 — Mutations & Optimistic Updates

In this part, we’ll learn how to **create, update, and delete data** using React Query’s `useMutation` hook. We’ll also cover **optimistic updates** for a fast, responsive UI and **cache invalidation** to keep data consistent.

---

## 🔹 Creating a Mutation with `useMutation`

We’ll add a function to create a new todo.

Create `src/api/mutations.ts`:

```ts
import { api } from './axios';
import { Todo } from './todos';

export const addTodo = async (title: string): Promise<Todo> => {
  const response = await api.post('/todos', { title, completed: false });
  return response.data;
};
```

---

## 🔹 Using `useMutation` in the Component

```tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTodo } from '../api/mutations';
import { fetchTodos, Todo } from '../api/todos';

function AddTodo() {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      // Invalidate and refetch todos after a successful mutation
      queryClient.invalidateQueries(['todos']);
      setTitle('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate(title);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 flex-1"
        placeholder="Add a new todo"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {mutation.isLoading ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

export default AddTodo;
```

---

## 🔹 How Optimistic Updates Work

Optimistic updates immediately update the UI before the server responds. Steps:

1. Update the cache locally.
2. Render the UI instantly.
3. Rollback if the server fails.

Example:

```tsx
const mutation = useMutation({
  mutationFn: addTodo,
  onMutate: async (newTitle: string) => {
    await queryClient.cancelQueries(['todos']);

    const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);

    queryClient.setQueryData<Todo[]>(['todos'], old => [
      ...(old || []),
      { id: Date.now(), title: newTitle, completed: false },
    ]);

    return { previousTodos };
  },
  onError: (_err, _newTodo, context) => {
    queryClient.setQueryData(['todos'], context?.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['todos']);
  },
});
```

Explanation:

- `onMutate`: Runs before mutation; updates cache optimistically.
- `onError`: Rolls back if mutation fails.
- `onSettled`: Always refetches to ensure server sync.

---

## 🔹 Cache Invalidation and Callbacks

| Callback    | Purpose                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `onSuccess` | Runs after successful mutation; often used to invalidate queries.          |
| `onError`   | Runs if mutation fails; can rollback optimistic updates.                   |
| `onSettled` | Runs after mutation regardless of success/failure; ensures data sync. |

- `invalidateQueries` tells React Query to refetch data for the given query key.
- Optimistic updates give the user instant feedback, improving UX.

---

## ✅ Key Takeaways from Part 5

- `useMutation` handles create, update, delete operations.
- Optimistic updates update the UI instantly before server confirmation.
- Cache invalidation ensures data consistency across components.
- Callbacks (`onMutate`, `onError`, `onSuccess`, `onSettled`) provide fine-grained control over server state.
- Combining mutations with `useQuery` keeps the app fast and reactive.

---

## 📖 Part 6 — Putting it Together

In this part, we’ll combine the **Todos list** and **AddTodo form** in one component, demonstrating **data consistency** and the **optimistic UI pattern** in action.

---

## 🔹 Combining List and Form

Create `src/pages/TodosPage.tsx`:

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTodos, Todo } from '../api/todos';
import AddTodo from '../components/AddTodo';

function TodosPage() {
  const { data: todos, isLoading, error } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching todos</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <AddTodo />
      <ul className="space-y-2">
        {todos?.map(todo => (
          <li
            key={todo.id}
            className="p-2 border rounded flex justify-between"
          >
            <span>{todo.title}</span>
            <span>{todo.completed ? '✅' : '❌'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodosPage;
```

Explanation:

- AddTodo form and todos list are in the same page.
- React Query automatically updates the list when a new todo is added.
- Optimistic updates in AddTodo make the UI feel instantaneous.
- Cache invalidation ensures the list stays consistent with the server.

---

## 🔹 Data Consistency & Optimistic UI

1. User submits a new todo via AddTodo.
2. `onMutate` updates the cached todos immediately (optimistic update).
3. Mutation sends POST request to server.
4. **On success:**
   - `onSuccess` invalidates `['todos']` query.
   - Refetch ensures server and cache are consistent.
5. **On error:**
   - `onError` rolls back to the previous cache state.
   - `onSettled` always ensures a final sync with the server.

---

## 🔹 UI Flow Diagram (Conceptual)

```
User adds Todo
       |
       v
Optimistic update -> UI shows new Todo immediately
       |
       v
Server mutation
   |         |
 Success   Error
   |         |
Invalidate  Rollback
   v
Refetch -> UI stays consistent with server
```

---

## ✅ Key Takeaways from Part 6

- Combining list and form demonstrates React Query's reactive nature.
- Optimistic updates improve perceived performance.
- Cache invalidation and query refetching maintain data consistency.
- This pattern can be reused for updates and deletions.
- React Query reduces boilerplate and manual state management in CRUD apps.

---

## 📖 Part 7 — useQueries

In this part, we’ll learn how to fetch **multiple queries in parallel** using React Query’s `useQueries` hook and understand **when and why to use it**.

---

## 🔹 What is `useQueries`?

- `useQueries` allows you to **run multiple queries at once**.
- Each query can have its own `queryKey` and `queryFn`.
- Useful for fetching **related but independent data** simultaneously.

---

## 🔹 Example: Fetching Todos and Users

Suppose we want to display todos along with user information.

```tsx
import React from 'react';
import { useQueries } from '@tanstack/react-query';
import { api } from '../api/axios';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface User {
  id: number;
  name: string;
}

function TodosWithUsers() {
  const results = useQueries({
    queries: [
      {
        queryKey: ['todos'],
        queryFn: async (): Promise<Todo[]> => {
          const res = await api.get('/todos');
          return res.data;
        },
      },
      {
        queryKey: ['users'],
        queryFn: async (): Promise<User[]> => {
          const res = await api.get('/users');
          return res.data;
        },
      },
    ],
  });

  const todosQuery = results[0];
  const usersQuery = results[1];

  if (todosQuery.isLoading || usersQuery.isLoading) return <div>Loading...</div>;
  if (todosQuery.error || usersQuery.error) return <div>Error fetching data</div>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todos with Users</h1>
      <ul className="space-y-2">
        {todosQuery.data?.map(todo => {
          const user = usersQuery.data?.find(u => u.id === todo.userId);
          return (
            <li key={todo.id} className="p-2 border rounded flex justify-between">
              <span>{todo.title} ({user?.name})</span>
              <span>{todo.completed ? '✅' : '❌'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TodosWithUsers;
```

Explanation:

useQueries takes an array of query objects.

Each query behaves like useQuery.

Results are returned in the same order as queries.

Useful when you need independent data to render the UI together.

🔹 When to Use useQueries
Scenario Recommendation
Multiple independent API calls Use useQueries to fetch them in parallel
Dependent queries (one needs another’s data) Use dependent queries instead (see Part 8 notes)
Large number of dynamic queries Consider using Promise.all in a single queryFn

✅ Key Takeaways from Part 7

useQueries enables parallel fetching of multiple independent queries.

Each query has its own queryKey and queryFn.

Ideal for fetching related but separate data sets without nesting queries.

Reduces loading delays and improves UX by fetching in parallel.

For dependent queries, other strategies like dependent queries or chained queries are better

---

## 📖 Part 8 — Production-Level Notes

In this part, we'll discuss **best practices, common patterns, cache timing, pagination, and dependent queries** to make your React Query apps production-ready.

---

## 🔹 Common Patterns

### 1. Centralized API folder

- Keep all API calls in one place (`src/api`) for modularity.
- Example: `todos.ts`, `mutations.ts`, `users.ts`.

### 2. Custom hooks for queries and mutations

- Wrap `useQuery` and `useMutation` in custom hooks for reuse.
- Example:

```ts
import { useQuery } from '@tanstack/react-query';
import { fetchTodos } from '../api/todos';

export const useTodos = () => useQuery(['todos'], fetchTodos);
```

### 3. Component composition

- Keep components focused on UI.
- Let hooks handle data fetching and mutations.

### 4. Optimistic updates for CRUD

- Use `onMutate`, `onError`, `onSettled` to update cache instantly and rollback if needed.

---

## 🔹 Cache Timing

| Option                 | Description                         | Example                           |
| ---------------------- | ----------------------------------- | --------------------------------- |
| `staleTime`            | Time data is considered fresh       | 1 minute: `staleTime: 1000 * 60`    |
| `cacheTime`            | Time unused data stays in memory    | 5 minutes: `cacheTime: 1000 * 60 * 5` |
| `refetchOnWindowFocus` | Refetch data when window is focused | `true`                            |
| `refetchOnReconnect`   | Refetch when network reconnects     | `true`                            |

---

## 🔹 Pagination (Brief Overview)

React Query supports cursor-based or page-based pagination.

Example pattern:

```tsx
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery(
  ['todos'],
  ({ pageParam = 1 }) => api.get(`/todos?_page=${pageParam}`),
  {
    getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
  }
);
```

Key points:

- Use `fetchNextPage()` to load more items.
- `hasNextPage` indicates if more data is available.

---

## 🔹 Dependent Queries (Brief Overview)

Sometimes a query depends on another query's data.

Example: Fetch todos for a selected user:

```tsx
const { data: users } = useQuery(['users'], fetchUsers);
const userId = users?.[0]?.id;

const { data: todos } = useQuery({
  queryKey: ['todos', userId],
  queryFn: () => fetchTodosByUser(userId),
  enabled: !!userId, // only run when userId exists
});
```

- `enabled` ensures the query only runs when prerequisites are ready.

---

## 🔹 Other Production-Level Tips

- **Error boundaries**: Wrap queries in error boundaries for better UX.
- **React Query DevTools**: Always include in development for debugging.
- **Prefetching**: Use `queryClient.prefetchQuery` to load data before navigating.
- **Infinite scroll & caching**: Combine `useInfiniteQuery` and cache optimally to reduce server load.
- **Query invalidation strategies**: Decide which queries to invalidate after mutations for consistent UI.

---

## ✅ Key Takeaways from Part 8

- Use custom hooks and centralized API for modular, scalable code.
- Adjust `staleTime` and `cacheTime` according to data type.
- Handle pagination and dependent queries carefully for production apps.
- Leverage optimistic updates, prefetching, and devtools to enhance UX and developer experience.
- React Query patterns help reduce boilerplate, improve performance, and maintain data consistency.
