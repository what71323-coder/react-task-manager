import { useState, useEffect, useMemo } from "react";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";

import {
  createTask,
  filterTasks,
  searchTasks,
  getTaskCounts,
  loadTasks,
  saveTasks
} from "./utils/taskUtils";

function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const counts = useMemo(() => getTaskCounts(tasks), [tasks]);

  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, status);
    return searchTasks(filtered, search);
  }, [tasks, status, search]);

  function handleAddTask(title, description) {
    const newTask = createTask(title, description);
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleToggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function handleUpdateTask(updatedTask) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );

    setEditingTask(null);
  }

  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  }

  function handleEditTask(task) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div>
            <span className="header-label">PRODUCTIVITY WORKSPACE</span>
            <h1>Task Manager</h1>
            <p>Organize your work. Complete your goals.</p>
          </div>

          <div className="header-icon">✓</div>
        </div>
      </header>

      <main className="dashboard">
        <section className="stats-grid" aria-label="Task statistics">
          <div className="stat-card total-card">
            <span className="stat-label">Total Tasks</span>
            <h2>{counts.total}</h2>
            <span className="stat-icon">📋</span>
          </div>

          <div className="stat-card completed-card">
            <span className="stat-label">Completed</span>
            <h2>{counts.completed}</h2>
            <span className="stat-icon">✓</span>
          </div>

          <div className="stat-card pending-card">
            <span className="stat-label">Pending</span>
            <h2>{counts.pending}</h2>
            <span className="stat-icon">⏳</span>
          </div>
        </section>

        <section className="workspace">
          <aside className="sidebar">
            <TaskForm
              onAddTask={handleAddTask}
              editingTask={editingTask}
              onUpdateTask={handleUpdateTask}
              onCancelEdit={handleCancelEdit}
            />
          </aside>

          <section className="tasks-section">
            <div className="tasks-heading">
              <div>
                <h2>My Tasks</h2>
                <p>Manage and track your daily activities</p>
              </div>

              <span className="task-total">
                {visibleTasks.length} tasks
              </span>
            </div>

            <TaskFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
            />

            <TaskList
              tasks={visibleTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </section>
        </section>
      </main>

      <footer className="app-footer">
        React Task Manager · Built with automated testing
      </footer>
    </div>
  );
}

export default App;