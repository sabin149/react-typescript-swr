import axios from "axios";

// const delay = () => new Promise((resolve) => setTimeout(resolve, 800));

const todosApi = axios.create({
  baseURL: "http://localhost:4000",
});

export interface TodoInterface {
  userId: number;
  title: string;
  completed: boolean;
  id: string;
}

export const todosUrlEndpoint = "/todos";

export const getTodos = async (url: string): Promise<TodoInterface[]> => {
  const response = await todosApi.get(url);
  return response.data;
};

export const addTodo = async ({
  userId,
  title,
  completed,
}: TodoInterface): Promise<TodoInterface> => {
  // if (Math.random() < 0.5) throw new Error("Random error");
  const response = await todosApi.post(todosUrlEndpoint, {
    userId,
    title,
    completed,
  });
  return response.data;
};

export const updateTodo = async (
  todo: TodoInterface
): Promise<TodoInterface> => {
  const response = await todosApi.patch(`${todosUrlEndpoint}/${todo.id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await todosApi.delete(`${todosUrlEndpoint}/${id}`);
};
