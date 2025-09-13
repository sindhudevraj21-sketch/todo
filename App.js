import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => { fetchTodos(); }, []);

  async function fetchTodos() {
    const res = await fetch('/api/todos'); // with proxy or same-origin in production
    const data = await res.json();
    setTodos(data);
  }

  async function addTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    const newTodo = await res.json();
    setTodos(prev => [newTodo, ...prev]);
    setTitle('');
  }

  async function toggleComplete(id) {
    const todo = todos.find(t => t._id === id);
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });
    const updated = await res.json();
    setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
  }

  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(prev => prev.filter(t => t._id !== id));
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16 }}>
      <h2>Simple MERN Todo</h2>
      <form onSubmit={addTodo}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New todo" />
        <button type="submit">Add</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleComplete(todo._id)} />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>{todo.title}</span>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;