import { useState } from 'react';

export default function AddTodoForm({ setTodos }) {
	const [newTodo, setNewTodo] = useState('');

	function handleSubmit(e) {
		e.preventDefault();
		if (newTodo.trim().length < 1 || !newTodo) return;

		const todo = { task: newTodo, id: crypto.randomUUID(), isComplete: false };

		setTodos(prev => [...prev, todo]);
		setNewTodo('');
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-1">
			<label className="text-xs mt-2 text-slate-800" htmlFor="newTodo">
				New Todo Item
			</label>
			<input
				className="p-1 border border-slate-600 rounded"
				type="text"
				id="newTodo"
				value={newTodo}
				onChange={e => setNewTodo(e.target.value)}
			/>
			<button className="mt-2 py-1 rounded hover:bg-cyan-100 transition bg-blue-200">
				Submit
			</button>
		</form>
	);
}
