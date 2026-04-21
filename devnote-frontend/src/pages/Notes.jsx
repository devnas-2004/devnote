// src/pages/Notes.jsx
import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/api/notes`;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    } else {
      fetchNotes();
    }
    // eslint-disable-next-line
  }, []);

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch notes failed:", text);
        return;
      }

      const data = await res.json();
      setNotes(data.notes || data); // flexible for backend format
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add note
  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Add note failed:", text);
        return;
      }

      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  // Start editing
  const startEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Update note
  const updateNote = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch(`${API_URL}/${editId}`, {  // ✅ FIXED
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update failed:", text);
        return;
      }

      setTitle("");
      setContent("");
      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {  // ✅ FIXED
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", text);
        return;
      }

      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className={`container mt-5 ${darkMode ? "bg-dark text-light" : ""}`}>
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Notes</h2>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={editId ? updateNote : addNote} className="mb-4">
        <input
          type="text"
          placeholder="Title"
          className={`form-control mb-2 ${darkMode ? "bg-secondary text-light" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className={`form-control mb-2 ${darkMode ? "bg-secondary text-light" : ""}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">
          {editId ? "Update Note" : "Add Note"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Loading */}
      {loading && <p>Loading notes...</p>}

      {/* Notes */}
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {notes.map((note) => (
          <div className="col" key={note._id}>
            <div
              className={`card shadow-sm rounded-3 ${darkMode ? "bg-secondary text-light" : ""}`}
              style={{ transition: "transform 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body">
                <h5 className="card-title">{note.title}</h5>
                <p className="card-text">{note.content}</p>

                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => startEdit(note)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteNote(note._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}