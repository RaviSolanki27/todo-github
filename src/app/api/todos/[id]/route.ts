import { NextResponse } from "next/server";
import { removeTodo, toggleTodo } from "@/lib/todoStore";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(_: Request, { params }: Params) {
  const { id } = await params;
  const todo = toggleTodo(id);

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ todo });
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const removed = removeTodo(id);

  if (!removed) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
