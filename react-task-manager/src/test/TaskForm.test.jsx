import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TaskForm from "../components/TaskForm";

describe("TaskForm", () => {
  test("renders required form fields", () => {
    render(
      <TaskForm
        onAddTask={vi.fn()}
        editingTask={null}
        onUpdateTask={vi.fn()}
        onCancelEdit={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
  });

  test("allows user to enter title and description", async () => {
    const user = userEvent.setup();

    render(
      <TaskForm
        onAddTask={vi.fn()}
        editingTask={null}
        onUpdateTask={vi.fn()}
        onCancelEdit={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText(/task title/i), "Learn React");
    await user.type(screen.getByLabelText(/description/i), "Practice hooks");

    expect(screen.getByLabelText(/task title/i)).toHaveValue("Learn React");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Practice hooks");
  });

  test("submits a new task", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(
      <TaskForm
        onAddTask={onAddTask}
        editingTask={null}
        onUpdateTask={vi.fn()}
        onCancelEdit={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText(/task title/i), "Learn Testing");
    await user.type(screen.getByLabelText(/description/i), "Vitest practice");

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAddTask).toHaveBeenCalledWith(
      "Learn Testing",
      "Vitest practice"
    );
  });

  test("shows validation error for empty title", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(
      <TaskForm
        onAddTask={onAddTask}
        editingTask={null}
        onUpdateTask={vi.fn()}
        onCancelEdit={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Task title is required."
    );

    expect(onAddTask).not.toHaveBeenCalled();
  });

  test("submits trimmed task title", async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(
      <TaskForm
        onAddTask={onAddTask}
        editingTask={null}
        onUpdateTask={vi.fn()}
        onCancelEdit={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText(/task title/i), "  Test Task  ");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(onAddTask).toHaveBeenCalledWith("Test Task", "");
  });

  test("updates an existing task", async () => {
    const user = userEvent.setup();
    const onUpdateTask = vi.fn();

    const task = {
      id: "1",
      title: "Old Task",
      description: "Old description",
      completed: false,
      createdAt: "2026-11-23T10:00:00.000Z"
    };

    render(
      <TaskForm
        onAddTask={vi.fn()}
        editingTask={task}
        onUpdateTask={onUpdateTask}
        onCancelEdit={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/task title/i)).toHaveValue("Old Task");

    await user.clear(screen.getByLabelText(/task title/i));
    await user.type(screen.getByLabelText(/task title/i), "Updated Task");

    await user.click(screen.getByRole("button", { name: /update task/i }));

    expect(onUpdateTask).toHaveBeenCalledWith({
      ...task,
      title: "Updated Task",
      description: "Old description"
    });
  });

  test("calls cancel edit", async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();

    render(
      <TaskForm
        onAddTask={vi.fn()}
        editingTask={{
          id: "1",
          title: "Task",
          description: "",
          completed: false,
          createdAt: "2026-11-23T10:00:00.000Z"
        }}
        onUpdateTask={vi.fn()}
        onCancelEdit={onCancelEdit}
      />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancelEdit).toHaveBeenCalled();
  });
});