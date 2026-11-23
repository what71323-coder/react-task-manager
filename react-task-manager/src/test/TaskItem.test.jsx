import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TaskItem from "../components/TaskItem";

const task = {
  id: "1",
  title: "Learn Vitest",
  description: "Write automated tests",
  completed: false,
  createdAt: "2026-11-23T10:00:00.000Z"
};

describe("TaskItem", () => {
  test("displays task information", () => {
    render(
      <TaskItem
        task={task}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Learn Vitest")).toBeInTheDocument();
    expect(screen.getByText("Write automated tests")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("displays completed status", () => {
    render(
      <TaskItem
        task={{ ...task, completed: true }}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  test("calls onToggle when complete button is clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /complete learn vitest/i }));

    expect(onToggle).toHaveBeenCalledWith("1");
  });

  test("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={vi.fn()}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /edit learn vitest/i }));

    expect(onEdit).toHaveBeenCalledWith(task);
  });

  test("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={task}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole("button", { name: /delete learn vitest/i }));

    expect(onDelete).toHaveBeenCalledWith("1");
  });
});