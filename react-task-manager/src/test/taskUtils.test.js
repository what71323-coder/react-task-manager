import { describe, test, expect, beforeEach } from "vitest";

import {
  createTask,
  filterTasks,
  searchTasks,
  getTaskCounts,
  loadTasks,
  saveTasks
} from "../utils/taskUtils";

const sampleTasks = [
  {
    id: "1",
    title: "Learn React",
    description: "Practice React",
    completed: false,
    createdAt: "2026-11-23T10:00:00.000Z"
  },
  {
    id: "2",
    title: "Build Project",
    description: "Create dashboard",
    completed: true,
    createdAt: "2026-11-23T10:00:00.000Z"
  },
  {
    id: "3",
    title: "Study Testing",
    description: "Learn Vitest",
    completed: false,
    createdAt: "2026-11-23T10:00:00.000Z"
  }
];

describe("createTask", () => {
  test("creates a task with correct values", () => {
    const task = createTask("Learn React", "Practice components");

    expect(task.title).toBe("Learn React");
    expect(task.description).toBe("Practice components");
    expect(task.completed).toBe(false);
    expect(task.id).toBeTruthy();
    expect(task.createdAt).toBeTruthy();
  });

  test("removes extra spaces from title and description", () => {
    const task = createTask("  Learn React  ", "  Practice React  ");

    expect(task.title).toBe("Learn React");
    expect(task.description).toBe("Practice React");
  });

  test("throws error for empty title", () => {
    expect(() => createTask("")).toThrow("Task title is required");
  });

  test("throws error for spaces-only title", () => {
    expect(() => createTask("   ")).toThrow("Task title is required");
  });
});

describe("filterTasks", () => {
  test("returns all tasks", () => {
    expect(filterTasks(sampleTasks, "all")).toHaveLength(3);
  });

  test("returns completed tasks", () => {
    const result = filterTasks(sampleTasks, "completed");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Build Project");
  });

  test("returns pending tasks", () => {
    const result = filterTasks(sampleTasks, "pending");

    expect(result).toHaveLength(2);
  });

  test("returns empty array for empty task list", () => {
    expect(filterTasks([], "completed")).toEqual([]);
  });
});

describe("searchTasks", () => {
  test("searches tasks by title", () => {
    const result = searchTasks(sampleTasks, "react");

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Learn React");
  });

  test("search is case insensitive", () => {
    expect(searchTasks(sampleTasks, "REACT")).toHaveLength(1);
  });

  test("returns all tasks for empty search", () => {
    expect(searchTasks(sampleTasks, "")).toHaveLength(3);
  });

  test("returns empty array for unmatched search", () => {
    expect(searchTasks(sampleTasks, "xyz")).toEqual([]);
  });
});

describe("getTaskCounts", () => {
  test("calculates total, completed and pending", () => {
    expect(getTaskCounts(sampleTasks)).toEqual({
      total: 3,
      completed: 1,
      pending: 2
    });
  });

  test("handles empty tasks", () => {
    expect(getTaskCounts([])).toEqual({
      total: 0,
      completed: 0,
      pending: 0
    });
  });
});

describe("localStorage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("saves tasks to localStorage", () => {
    saveTasks(sampleTasks);

    expect(JSON.parse(localStorage.getItem("tasks"))).toEqual(sampleTasks);
  });

  test("loads saved tasks", () => {
    localStorage.setItem("tasks", JSON.stringify(sampleTasks));

    expect(loadTasks()).toEqual(sampleTasks);
  });

  test("returns empty array if no saved tasks", () => {
    expect(loadTasks()).toEqual([]);
  });

  test("handles invalid JSON", () => {
    localStorage.setItem("tasks", "invalid json");

    expect(loadTasks()).toEqual([]);
  });

  test("handles non-array data", () => {
    localStorage.setItem("tasks", JSON.stringify({ title: "Task" }));

    expect(loadTasks()).toEqual([]);
  });

  test("ignores invalid task entries", () => {
    localStorage.setItem(
      "tasks",
      JSON.stringify([
        sampleTasks[0],
        { title: "Invalid task" },
        null
      ])
    );

    expect(loadTasks()).toEqual([sampleTasks[0]]);
  });
});