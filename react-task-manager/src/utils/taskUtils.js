export function createTask(title, description = "") {
  if (!title || !title.trim()) {
    throw new Error("Task title is required");
  }

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
}

export function filterTasks(tasks, status = "all") {
  if (status === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (status === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  return tasks;
}

export function searchTasks(tasks, searchText = "") {
  const search = searchText.trim().toLowerCase();

  if (!search) {
    return tasks;
  }

  return tasks.filter((task) =>
    task.title.toLowerCase().includes(search)
  );
}

export function getTaskCounts(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;

  return {
    total: tasks.length,
    completed,
    pending
  };
}

export function loadTasks() {
  try {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.title === "string" &&
        typeof task.completed === "boolean"
    );
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}