"use client";

import { FormEvent, useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTodos() {
    setLoading(true);
    const response = await fetch("/api/todos", { cache: "no-store" });
    const data = (await response.json()) as { todos: Todo[] };
    setTodos(data.todos);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    fetch("/api/todos", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ todos: Todo[] }>)
      .then((data) => {
        if (!cancelled) {
          setTodos(data.todos);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      return;
    }

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    setText("");
    await loadTodos();
  }

  async function toggleTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "PATCH" });
    await loadTodos();
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    await loadTodos();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto w-full max-w-xl rounded-lg bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">Todo App</h1>

        <form className="mb-6 flex gap-2" onSubmit={createTodo}>
          <input
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
            placeholder="Add a todo..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <button
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
            type="submit"
          >
            Add
          </button>
        </form>

        {loading ? (
          <p className="text-slate-500">Loading todos...</p>
        ) : todos.length === 0 ? (
          <p className="text-slate-500">No todos yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
              >
                <button
                  className={`text-left ${
                    todo.completed
                      ? "text-slate-400 line-through"
                      : "text-slate-800"
                  }`}
                  onClick={() => void toggleTodo(todo.id)}
                >
                  {todo.text}
                </button>
                <button
                  className="rounded-md bg-rose-500 px-2 py-1 text-sm text-white hover:bg-rose-600"
                  onClick={() => void deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
