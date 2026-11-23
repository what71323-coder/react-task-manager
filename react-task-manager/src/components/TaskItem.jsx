function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.title}</h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <span className={`status-badge ${task.completed ? "done" : "pending"}`}>
          {task.completed ? "Completed" : "Pending"}
        </span>

        <small className="task-date">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </small>
      </div>

      <div className="task-actions">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          className="complete-btn"
          aria-label={`${task.completed ? "Mark pending" : "Complete"} ${task.title}`}
        >
          {task.completed ? "Mark Pending" : "Complete"}
        </button>

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="edit-btn"
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="delete-btn"
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;