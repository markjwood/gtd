import AddTodoForm from './AddTodoForm';
import useLocalStorage from '../../hooks/useLocalStorage';

const LOCALSTORAGE_KEY = 'gtd.todos';

export default function TodoList() {
	const [todos, setTodos] = useLocalStorage(LOCALSTORAGE_KEY, [
		// placeholders can be deleted
		{ task: 'do this', id: '111', isComplete: false },
		{ task: 'do that', id: '222', isComplete: false },
		{ task: 'go away', id: '333', isComplete: true },
	]);

	// handlers
	function deleteTodo(id) {
		setTodos(prev => {
			return prev.filter(td => td.id !== id);
		});
	}

	function toggleComplete(id) {
		setTodos(prev =>
			prev.map(td => {
				if (td.id === id) {
					return { ...td, isComplete: !td.isComplete };
				} else return td;
			})
		);
	}

	return (
		<div>
			<ul>
				{todos.map(todo => (
					<li className="flex gap-2 items-center" key={todo.id}>
						<input
							type="checkbox"
							checked={todo.isComplete}
							onChange={() => toggleComplete(todo.id)}
						/>
						<button
							onClick={() => deleteTodo(todo.id)}
							className="text-red-500"
						>
							&times;
						</button>
						<span
							className={
								todo.isComplete ? 'line-through text-slate-400' : undefined
							}
						>
							{todo.task}
						</span>
					</li>
				))}
			</ul>
			<AddTodoForm setTodos={setTodos} />
		</div>
	);
}
