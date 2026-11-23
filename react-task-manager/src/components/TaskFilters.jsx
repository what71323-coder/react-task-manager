function TaskFilters({ search, setSearch, status, setStatus }) {
  return (
    <section className="task-filters">
      <div className="search-box">
        <label htmlFor="task-search">Search Tasks</label>

        <input
          id="task-search"
          type="search"
          placeholder="Search by task title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-box">
        <label htmlFor="task-status">Filter by Status</label>

        <select
          id="task-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </section>
    );
}

export default TaskFilters;