export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

type TodoStore = {
  todos: Todo[];
};

const globalStore = globalThis as typeof globalThis & {
  __todoStore?: TodoStore;
};

if (!globalStore.__todoStore) {
  globalStore.__todoStore = {
    todos: [],
  };
}

function getStore() {
  return globalStore.__todoStore!;
}

export function listTodos() {
  return [...getStore().todos];
}

export function createTodo(text: string) {
  const todo: Todo = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  getStore().todos.unshift(todo);
  return todo;
}

export function toggleTodo(id: string) {
  const todo = getStore().todos.find((item) => item.id === id);
  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;
  return todo;
}

export function removeTodo(id: string) {
  const todos = getStore().todos;
  const index = todos.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  return true;
}
