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
  // addMutation as AddTodo,
  addTodoOptions,
  deleteTodoOptions,
  updateTodoOptions,
} from "../../helpers/todosMutation";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const key: Key = `${cacheKey}?_page=${currentPage}&_limit=10`;

  const fetcher: Fetcher<any> = (url: string): Promise<TodoInterface[]> => {
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const PageSize = 10;

  // Add useSWR here

  const addTodoMutation = async (newTodo: TodoInterface) => {
    try {
      // call API & mutate here
      // await mutate(addTodo(newTodo), addTodoOptions(newTodo));
      await mutate([addTodo(newTodo)], addTodoOptions(newTodo));

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
            <label htmlFor="id">{todo.id}</label>
            <input
              type="checkbox"
              checked={todo.completed}
              id={todo.id}
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

  let pagination;
  if (todos && todos.length > 0) {
    pagination = (
      <div className="pagination">
        {/* advanced pagination */}

        <button
          onClick={() => handleChangePage(null, currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() => handleChangePage(null, currentPage + 1)}
          disabled={currentPage === Math.ceil(todos.length / PageSize)}
        >
          Next
        </button>
      </div>
    );
  }

  return (
    <main>
      <Toaster toastOptions={{ position: "top-center" }} />
      <h1>Todo List</h1>
      {newItemSection}
      {content}
      {pagination}
    </main>
  );
};
export default TodoList;
