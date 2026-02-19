import { NextResponse } from "next/server";
import { createTodo, listTodos } from "@/lib/todoStore";

export async function GET() {
  return NextResponse.json({ todos: listTodos() });
}

export async function POST(request: Request) {
  let body: { text?: unknown } = {};
  try {
    body = (await request.json()) as { text?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 },
    );
  }

  const todo = createTodo(text);
  return NextResponse.json({ todo }, { status: 201 });
}
