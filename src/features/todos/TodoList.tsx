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
import {
  addTodoOptions,
  deleteTodoOptions,
  updateTodoOptions,
} from "../../helpers/todosMutation";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const key: Key = `${cacheKey}`;

  const fetcher = (url: string): any => {
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

      await mutate(addTodo(newTodo), addTodoOptions(newTodo));
      console.log("new todo after adding", todos);
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

  const updateTodoMutation = async (updatedTodo: TodoInterface) => {
    try {
      // call API & mutate here
      // await updateTodo(updatedTodo)
      // mutate()
      await mutate(updateTodo(updatedTodo), updateTodoOptions(updatedTodo));
      toast.success("Success! Updated item.", {
        duration: 1000,
        icon: "🚀",
      });
    } catch (err) {
      toast.error("Failed to update the item.", {
        duration: 1000,
      });
    }
  };

  const deleteTodoMutation = async (id: string) => {
    try {
      // call API & mutate here
      await mutate(deleteTodo(id), deleteTodoOptions(id));
      toast.success("Success! Deleted item.", {
        duration: 1000,
      });
    } catch (err) {
      toast.error("Failed to delete the item.", {
        duration: 1000,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo || !todos) return;
    addTodoMutation({
      userId: 1,
      title: newTodo,
      completed: false,
      id: (todos.length + 1).toString(),
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
        <article key={index}>
          <div className="todo">
            <input
              type="checkbox"
              onChange={() =>
                updateTodoMutation({ ...todo, completed: !todo.completed })
              }
            />
            <label htmlFor={todo.id}>{todo.title}</label>
          </div>
          <button className="trash" onClick={() => deleteTodoMutation(todo.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </article>
      );
    });
  }

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
