import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

describe("Task Manager Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("shows the application and empty state", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Task Manager" })).toBeInTheDocument();
    expect(screen.getByText("No tasks found")).toBeInTheDocument();

    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  test("adds a task and updates statistics", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Learn React Testing");
    await user.type(screen.getByLabelText(/description/i), "Practice RTL");

    await user.click(screen.getByRole("button", { name: /add task/i }));

    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
    expect(screen.getByText("Practice RTL")).toBeInTheDocument();

    expect(screen.getByText("Total Tasks").parentElement).toHaveTextContent("1");
    expect(screen.getByText("Pending").parentElement).toHaveTextContent("1");
  });

  test("marks a task as completed and updates counts", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Testing Task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(
      screen.getByRole("button", { name: /complete testing task/i })
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Completed").parentElement).toHaveTextContent("1");
    expect(screen.getByText("Pending").parentElement).toHaveTextContent("0");
  });

  test("deletes a task and updates total count", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Delete Me");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /delete delete me/i }));

    expect(screen.queryByText("Delete Me")).not.toBeInTheDocument();
    expect(screen.getByText("Total Tasks").parentElement).toHaveTextContent("0");
  });

  test("edits an existing task", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Original Task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /edit original task/i }));

    const titleInput = screen.getByLabelText(/task title/i);

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task");

    await user.click(screen.getByRole("button", { name: /update task/i }));

    expect(screen.getByText("Updated Task")).toBeInTheDocument();
    expect(screen.queryByText("Original Task")).not.toBeInTheDocument();
  });

  test("searches tasks by title", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Learn React");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.type(screen.getByLabelText(/task title/i), "Learn Testing");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.type(screen.getByLabelText(/search tasks/i), "React");

    expect(screen.getByText("Learn React")).toBeInTheDocument();
    expect(screen.queryByText("Learn Testing")).not.toBeInTheDocument();
  });

  test("filters completed tasks", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Task One");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.type(screen.getByLabelText(/task title/i), "Task Two");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /complete task one/i }));

    await user.selectOptions(screen.getByLabelText(/filter by status/i), "completed");

    expect(screen.getByText("Task One")).toBeInTheDocument();
    expect(screen.queryByText("Task Two")).not.toBeInTheDocument();
  });

  test("filters pending tasks", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Task One");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.type(screen.getByLabelText(/task title/i), "Task Two");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(screen.getByRole("button", { name: /complete task one/i }));

    await user.selectOptions(screen.getByLabelText(/filter by status/i), "pending");

    expect(screen.getByText("Task Two")).toBeInTheDocument();
    expect(screen.queryByText("Task One")).not.toBeInTheDocument();
  });

  test("saves tasks in localStorage", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Saved Task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    const savedTasks = JSON.parse(localStorage.getItem("tasks"));

    expect(savedTasks).toHaveLength(1);
    expect(savedTasks[0].title).toBe("Saved Task");
  });

  test("loads saved tasks when application starts", () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        {
          id: "saved-1",
          title: "Previously Saved Task",
          description: "Loaded from storage",
          completed: true,
          createdAt: "2026-11-23T10:00:00.000Z"
        }
      ])
    );

    render(<App />);

    expect(screen.getByText("Previously Saved Task")).toBeInTheDocument();
    expect(screen.getByText("Completed").parentElement).toHaveTextContent("1");
  });

  test("handles invalid localStorage data", () => {
    localStorage.setItem("tasks", "invalid data");

    render(<App />);

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks").parentElement).toHaveTextContent("0");
  });

  test("completed task remains completed after reload", async () => {
    const user = userEvent.setup();

    const { unmount } = render(<App />);

    await user.type(screen.getByLabelText(/task title/i), "Persistent Task");
    await user.click(screen.getByRole("button", { name: /add task/i }));

    await user.click(
      screen.getByRole("button", { name: /complete persistent task/i })
    );

    unmount();

    render(<App />);

    expect(screen.getByText("Persistent Task")).toBeInTheDocument();
    expect(screen.getByText("Completed").parentElement).toHaveTextContent("1");
  });
});