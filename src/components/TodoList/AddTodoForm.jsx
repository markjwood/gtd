import { useEffect, useRef, useState } from 'react';

export default function AddTodoForm({ setTodos }) {
	const [newDeadline, setNewDeadline] = useState('');
	const taskRef = useRef();

	useEffect(() => {
		taskRef.current.focus();
	}, []);

	function handleSubmit(e) {
		e.preventDefault();
		const newTask = taskRef.current.value;
		if (newTask.trim().length < 1 || !newTask) return;

		const todo = {
			task: newTask,
			id: crypto.randomUUID(),
			deadline: newDeadline ?? null,
			isComplete: false,
		};

		setTodos(prev => [...prev, todo]);
		taskRef.current.value = '';
		taskRef.current.focus();
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-1">
			<div className="flex gap-2">
				<div className="flex flex-col grow">
					<label className="text-xs mt-2 text-slate-800" htmlFor="newTask">
						New Todo Item
					</label>
					<input
						className="p-1 border border-slate-600 rounded"
						type="text"
						id="newTask"
						ref={taskRef}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-xs mt-2 text-slate-800" htmlFor="newDeadline">
						Deadline
					</label>
					<input
						className="p-1 border border-slate-600 rounded"
						type="date"
						id="newDeadline"
						value={newDeadline}
						onChange={e => setNewDeadline(e.target.value)}
					/>
				</div>
			</div>
			<button className="mt-2 py-1 rounded hover:bg-cyan-100 transition bg-blue-200">
				Submit
			</button>
		</form>
	);
}
