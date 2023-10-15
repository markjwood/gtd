import Card from './components/Card';
import Header from './components/Header';
import Pomodoro from './components/Pomodoro';
import TodoList from './components/TodoList/TodoList';

function App() {
	return (
		<>
			<Header />
			<div className="mx-auto container px-2 md:flex md:gap-4 lg:gap-6 xl:gap-10">
				<Card title="Todo List">
					<TodoList />
				</Card>
				<Card title="Pomodoro Timer">
					<Pomodoro />
				</Card>
			</div>
		</>
	);
}

export default App;
