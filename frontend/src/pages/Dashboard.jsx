import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as tasksApi from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({ type: '', text: '' });
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: '', description: '' });

  const showBanner = useCallback((type, text) => {
    setBanner({ type, text });
    if (text) {
      window.setTimeout(() => setBanner({ type: '', text: '' }), 5000);
    }
  }, []);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksApi.fetchTasks();
      setTasks(res.data?.tasks || []);
    } catch (err) {
      const text = err.response?.data?.message || 'Could not load tasks';
      showBanner('error', text);
    } finally {
      setLoading(false);
    }
  }, [showBanner]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await tasksApi.createTask({
        title: newTask.title,
        description: newTask.description || undefined,
      });
      setNewTask({ title: '', description: '' });
      showBanner('success', 'Task created');
      await loadTasks();
    } catch (err) {
      showBanner('error', err.response?.data?.message || 'Create failed');
    }
  }

  function startEdit(task) {
    setEditingId(task._id);
    setEditDraft({ title: task.title, description: task.description || '' });
  }

  async function saveEdit(id) {
    try {
      await tasksApi.updateTask(id, {
        title: editDraft.title,
        description: editDraft.description,
      });
      setEditingId(null);
      showBanner('success', 'Task updated');
      await loadTasks();
    } catch (err) {
      showBanner('error', err.response?.data?.message || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await tasksApi.deleteTask(id);
      showBanner('success', 'Task deleted');
      await loadTasks();
    } catch (err) {
      showBanner('error', err.response?.data?.message || 'Delete failed');
    }
  }

  return (
    <div className="dashboard-page">
      <div className="layout">
      <header className="topbar">
        <div>
          <h1>Tasks</h1>
          <p className="muted">
            Signed in as <strong>{user?.name}</strong> ({user?.role})
            {isAdmin ? ' · You can delete any task' : ' · Only admins can delete tasks'}
          </p>
        </div>
        <div className="topbar-actions">
          <button type="button" className="dash-ghost" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {banner.text && (
        <div className={banner.type === 'error' ? 'banner error' : 'banner success'}>
          {banner.text}
        </div>
      )}

      <section className="card section">
        <h2>New task</h2>
        <form onSubmit={handleCreate} className="form inline">
          <input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
            required
          />
          <input
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
          />
          <button type="submit" className="dash-primary">
            Add
          </button>
        </form>
      </section>

      <section className="section">
        <h2>Your tasks</h2>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : tasks.length === 0 ? (
          <p className="muted">No tasks yet. Create one above.</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                {editingId === task._id ? (
                  <div className="form stack">
                    <input
                      value={editDraft.title}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, title: e.target.value }))
                      }
                    />
                    <textarea
                      rows={3}
                      value={editDraft.description}
                      onChange={(e) =>
                        setEditDraft((d) => ({ ...d, description: e.target.value }))
                      }
                    />
                    <div className="row">
                      <button type="button" className="dash-primary" onClick={() => saveEdit(task._id)}>
                        Save
                      </button>
                      <button type="button" className="dash-ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3>{task.title}</h3>
                      {task.description ? <p>{task.description}</p> : null}
                      <p className="muted small">
                        Updated {new Date(task.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="row">
                      <button type="button" className="dash-ghost" onClick={() => startEdit(task)}>
                        Edit
                      </button>
                      {isAdmin && (
                        <button type="button" className="dash-danger" onClick={() => handleDelete(task._id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="footer">
        <Link to="/login">Switch account</Link>
      </footer>
      </div>
    </div>
  );
}
