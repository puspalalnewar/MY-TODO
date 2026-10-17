import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaCheck,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
  FaClock,
} from "react-icons/fa";
import { toast } from "sonner";

import { getCurrentUser, logoutUser } from "../services/authService";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function Todo() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load user and tasks
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData.user);

        const taskData = await getTasks();
        setTasks(taskData.tasks);
      } catch (error) {
        toast.error(error.message);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add or update a task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        const data = await updateTask(editingId, {
          title: title.trim(),
        });

        setTasks((prev) =>
          prev.map((task) => (task._id === editingId ? data.task : task)),
        );

        toast.success("Task updated!");
      } else {
        const data = await createTask({
          title: title.trim(),
        });

        setTasks((prev) => [data.task, ...prev]);
        toast.success("Task added!");
      }

      setTitle("");
      setEditingId(null);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Edit a task
  const handleEdit = (task) => {
    setTitle(task.title);
    setEditingId(task._id);
  };

  // Mark task as complete or incomplete
  const handleToggle = async (task) => {
    try {
      const data = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((prev) =>
        prev.map((item) => (item._id === task._id ? data.task : item)),
      );

      toast.success(data.task.completed ? "Task completed!" : "Task reopened!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);

      setTasks((prev) => prev.filter((task) => task._id !== id));

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
      }

      toast.success("Task deleted!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        Loading your tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b bg-white px-5 py-4 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            PN
          </div>

          <span className="text-lg font-bold text-gray-900">PN-Todo-List</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>

      {/* Hero section */}
      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <section className="mb-8">
          <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            <span>
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <span className="flex items-center gap-2">
              <FaClock className="text-blue-600" />
              {currentTime.toLocaleTimeString("en-IN")}
            </span>
          </div>
        </section>

        {/* Add task */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex gap-2 rounded-xl border bg-white p-2 shadow-sm"
        >
          <input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
            required
            className="min-w-0 flex-1 bg-transparent px-3 py-2 outline-none"
          />

          <button
            type="submit"
            disabled={saving}
            aria-label={editingId ? "Update task" : "Add task"}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {editingId ? <FaEdit /> : <FaPlus />}
            <span className="hidden sm:inline">
              {saving ? "Saving..." : editingId ? "Update" : "Add"}
            </span>
          </button>
        </form>

        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setTitle("");
            }}
            className="mb-5 text-sm text-gray-500 hover:text-gray-900"
          >
            Cancel editing
          </button>
        )}

        {/* Task list */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            My Tasks ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white px-4 py-12 text-center">
              <p className="font-medium text-gray-700">No tasks yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Add your first task above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm"
                >
                  <button
                    onClick={() => handleToggle(task)}
                    aria-label={
                      task.completed ? "Mark incomplete" : "Mark complete"
                    }
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                      task.completed
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 text-transparent hover:border-green-500"
                    }`}
                  >
                    <FaCheck size={11} />
                  </button>

                  <span
                    className={`min-w-0 flex-1 break-words text-sm sm:text-base ${
                      task.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </span>

                  <button
                    onClick={() => handleEdit(task)}
                    aria-label="Edit task"
                    className="shrink-0 rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    aria-label="Delete task"
                    className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400">
        PN-Todo-List © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Todo;
