import { useEffect, useState } from "react";
import API from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await API.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please enter a task title");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const createdTask = await API.createTask({ title: trimmedTitle });
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setTitle("");
    } catch (err) {
      setError(err.message || "Unable to add task");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");
      const updatedTask = await API.updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === updatedTask._id ? updatedTask : currentTask
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update task");
    }
  };

  const removeTask = async (taskId) => {
    try {
      setError("");
      await API.deleteTask(taskId);
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );
    } catch (err) {
      setError(err.message || "Unable to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <section className="task-card">
        <div className="hero">
          <p className="eyebrow">MongoDB Connected Task Flow</p>
          <h1>Smart Task Manager</h1>
          <p className="hero-copy">
            Create, complete, and delete tasks from a frontend that is wired to
            your Express API and stored in MongoDB.
          </p>
        </div>

        <div className="stats">
          <article className="stat-box">
            <span>Total Tasks</span>
            <strong>{tasks.length}</strong>
          </article>
          <article className="stat-box">
            <span>Completed</span>
            <strong>{completedCount}</strong>
          </article>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new task"
            aria-label="Task title"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add Task"}
          </button>
        </form>

        {error ? <p className="status error">{error}</p> : null}
        {loading ? <p className="status">Loading tasks...</p> : null}
        {!loading && tasks.length === 0 ? (
          <p className="status">No tasks yet. Add one to store it in MongoDB.</p>
        ) : null}

        <ul className="task-list">
          {tasks.map((task) => (
            <li className="task-item" key={task._id}>
              <label className="task-main">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />
                <span className={task.completed ? "task-title done" : "task-title"}>
                  {task.title}
                </span>
              </label>
              <button
                type="button"
                className="delete-button"
                onClick={() => removeTask(task._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
