import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import React, { useMemo, useState } from "react";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  todosUrlEndpoint as cacheKey,
  TodoInterface,
} from "../../api/todosApi";
import useSWR, { Fetcher, Key } from "swr";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const key: Key = `${cacheKey}`;

  const fetcher: Fetcher<any, string> = (
    url: string
  ): Promise<TodoInterface[]> => {
    return getTodos(url);
  };
  const {
    data: todos,
    error,
    isLoading,
    mutate,
  } = useSWR(key, fetcher, {
    onSuccess: (data: TodoInterface[]) =>
      data.sort((a, b): number => parseInt(b.id) - parseInt(a.id)),
  });

  const addTodoMutation = async (newTodo: TodoInterface) => {
    try {
      // call API & mutate here

      await mutate(addTodo(newTodo), {
        // optimistic data displays until we populate cache
        // param is previous data
        optimisticData: (todos: TodoInterface[]) => {
          return [...todos, newTodo].sort(
            (a, b) => parseInt(b.id) - parseInt(a.id)
          );
        },
        rollbackOnError: true,
        populateCache: (added: TodoInterface, todos: TodoInterface[]) =>
          [...todos, added].sort((a, b) => parseInt(b.id) - parseInt(a.id)),
        revalidate: false,
      });
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

  const handleSubmit = (e: React.FormEvent) => {
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
    content = todos.map((todo: TodoInterface, index: number) => {
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

  const todoLength = useMemo(() => {
    return todos?.length;
  }, []);

  console.log("todoLength", todoLength);

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
