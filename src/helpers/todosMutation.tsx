import {
  addTodo,
  deleteTodo,
  TodoInterface,
  updateTodo,
} from "../api/todosApi";

// export const addMutation = async (newTodo, todos) => {
//     const added = await addTodo(newTodo);
//     return [...todos, added]
//         .sort((a, b) => b.id - a.id);
// }

// export const addTodoOptions = (newTodo, todos) => {
//     return {
//         optimisticData: [...todos, newTodo]
//             .sort((a, b) => b.id - a.id),
//         rollbackOnError: true,
//         populateCache: true,
//         revalidate: false
//     }
// }

export const addTodoOptions = (newTodo: TodoInterface) => {
  return {
    // optimistic data displays until we populate cache
    // param is previous data
    optimisticData: (todos: TodoInterface[]) =>
      [...todos, newTodo].sort((a, b) => parseInt(b.id) - parseInt(a.id)),
    rollbackOnError: true,
    populateCache: (added: TodoInterface, todos: TodoInterface[]) =>
      [...todos, added].sort((a, b) => parseInt(b.id) - parseInt(a.id)),
    revalidate: false,
  };
};

export const updateTodoOptions = (updatedTodo: TodoInterface) => {
  return {
    // optimistic data displays until we populate cache
    // param is previous data
    optimisticData: (todos: TodoInterface[]) => {
      const prevTodos = todos.filter((todo) => {
        return todo.id !== updatedTodo.id;
      });
      return [...prevTodos, updatedTodo].sort(
        (a: TodoInterface, b: TodoInterface): number =>
          parseInt(b.id) - parseInt(a.id)
      );
    },
    rollbackOnError: true,
    // response from API request is 1st param
    // previous data is 2nd param
    populateCache: (updated: TodoInterface, todos: TodoInterface[]) => {
      const prevTodos = todos.filter((todo: TodoInterface) => {
        return todo.id !== updatedTodo.id;
      });
      return [...prevTodos, updated].sort(
        (a: TodoInterface, b: TodoInterface): number =>
          parseInt(b.id) - parseInt(a.id)
      );
    },
    revalidate: false,
  };
};

export const deleteTodoOptions = (id: string) => {
  return {
    // optimistic data displays until we populate cache
    // param is previous data
    optimisticData: (todos: TodoInterface[]) => {
      return todos.filter((todo: TodoInterface) => {
        return todo.id !== id;
      });
    },
    rollbackOnError: true,
    // response from API request is 1st param
    // previous data is 2nd param
    populateCache: (_emptyResponseObj: any, todos: TodoInterface[]) => {
      return todos.filter((todo) => {
        return todo.id !== id;
      });
    },
    revalidate: false,
  };
};
