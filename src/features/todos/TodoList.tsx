import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import React, { useMemo, useState } from "react";
import useSWR, { Fetcher, Key } from "swr";
import axios from "axios";

const todosApi = axios.create({
  baseURL: "http://localhost:4000",
});

export interface TodoInterface<T = any> {
  userId: number;
  title: string;
  completed: boolean;
  id: T;
}

export const todosUrlEndpoint = "/todos";

export const getTodos = async <T = any,>(
  url: string
): Promise<TodoInterface<T>[]> => {
  const response = await todosApi.get(url);
  return response.data;
};

export const addTodo = async <T = any,>({
  userId,
  title,
  completed,
  id,
}: TodoInterface<T>): Promise<TodoInterface<T>> => {
  const response = await todosApi.post(todosUrlEndpoint, {
    userId,
    title,
    completed,
    id,
  });
  return response.data;
};

export const addTodoOptions = <T,>(newTodo: TodoInterface<T>) => {
  return {
    optimisticData: (todos: TodoInterface<T>[]) =>
      [...todos, newTodo].sort(
        (a, b) => parseInt(b.id as any) - parseInt(a.id as any)
      ),
    rollbackOnError: true,
    populateCache: (added: TodoInterface<T>, todos: TodoInterface<T>[]) =>
      [...todos, added].sort(
        (a, b) => parseInt(b.id as any) - parseInt(a.id as any)
      ),
    revalidate: false,
  };
};

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const key: Key = `${todosUrlEndpoint}`;

  const fetcher: Fetcher<TodoInterface[]> = (url: string): any => {
    return getTodos(url);
  };
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR(key, fetcher, {
    onSuccess: (data: TodoInterface[]) =>
      data.sort(
        (a, b): number => parseInt(b.id as any) - parseInt(a.id as any)
      ),
  });

  // const addTodoMutation = async (newTodo: TodoInterface) => {
  //   try {
  //     await mutate(await addTodo(newTodo), addTodoOptions(newTodo));
  //     toast.success("Success! Added new item.", {
  //       duration: 1000,
  //       icon: "🎉",
  //     });
  //   } catch (err) {
  //     toast.error("Failed to add the new item.", {
  //       duration: 1000,
  //     });
  //   }
  // };

  const addTodoMutation = async (newTodo: TodoInterface) => {
    try {
      await mutate(async (todos: TodoInterface[] = []) => {
        const addedTodo = await addTodo(newTodo);
        return [...todos, addedTodo].sort(
          (a, b) => parseInt(b.id as any) - parseInt(a.id as any)
        );
      }, false);
      toast.success("Success! Added new item.", {
        duration: 1000,
        icon: "🎉",
      });
    } catch (err) {
      toast.error("Failed to add the new item.", {
        duration: 1000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTodo) return;
    addTodoMutation({
      userId: 1,
      title: newTodo,
      completed: false,
      id: "9999",
    });
    setNewTodo("");
  };

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error.message}</p>;
  } else {
    content = todos?.map((todo: TodoInterface, index: number) => {
      return (
        <article key={todo.id}>
          <div className="todo">
            <label htmlFor="id">{index + 1}</label>
            <input type="checkbox" />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button className="trash">
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }

  const TodosLength = useMemo(() => {
    return todos?.length;
  }, [todos]);

  console.log("TodosLength", TodosLength);

  return (
    <main>
      <Toaster toastOptions={{ position: "top-center" }} />
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};
export default TodoList;
