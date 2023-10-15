import { useEffect, useState } from 'react';
import { PlayBtn, PauseBtn, StopBtn, BackBtn, ForwardBtn } from '../Icons';
import useCountdown from '../hooks/useCountdown';
import useLocalStorage from '../hooks/useLocalStorage';

const LOCALSTORAGE_KEY = 'gtd.pomodoroSettings';
const DEFAULT_TIMERS = {
	// times in minutes
	focus: 25,
	shortBreak: 5,
	longBreak: 30,
	// sessions between long breaks
	sessions: 4,
};

export default function Pomodoro() {
	const [timers, setTimers] = useLocalStorage(LOCALSTORAGE_KEY, DEFAULT_TIMERS);
	const [currentTimer, setCurrentTimer] = useState('focus');
	const [sessionCounter, setSessionCounter] = useState(timers.sessions);

	const { isRunning, secondsLeft, setTimer, toggleTimer, stop } =
		useCountdown();

	useEffect(() => {
		if (currentTimer === 'focus') {
			console.log(sessionCounter);
			setSessionCounter(c => c - 1);
		}
		setTimer(timers[currentTimer]);
	}, [currentTimer, timers]);

	useEffect(() => {
		if (secondsLeft === 0) {
			if (isRunning) getNextTimer();
			else return () => setCurrentTimer('focus');
		}
	}, [secondsLeft]);

	// helper functions
	function getNextTimer() {
		setCurrentTimer(prev => {
			if (prev !== 'focus') {
				// setSessionCounter(count => count - 1);
				return 'focus';
			}
			if (sessionCounter === 0) {
				// setSessionCounter(timers.sessions + 1);
				return 'longBreak';
			}
			return 'shortBreak';

			if (sessionCounter >= 0) {
				setSessionCounter(count => {
					console.log(count);
					return count - 1;
				});
				return 'shortBreak';
			}

			setSessionCounter(timers.sessions);
			return 'longBreak';
		});
	}

	function getDisplayTime(seconds) {
		const hrs = seconds > 3600 ? Math.floor(seconds / 3600) : 0;
		const mins = Math.floor(seconds / 60) - hrs * 60;
		const secs = (seconds % 60).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
		});

		return `${hrs > 0 ? hrs + ':' : ''}${
			hrs > 0
				? mins.toLocaleString('en-US', {
						minimumIntegerDigits: 2,
				  })
				: mins
		}:${secs}`;
	}

	// handler functions
	function handleStop() {
		stop();
		setSessionCounter(timers.sessions);
		setCurrentTimer(timers.focus);
	}

	return (
		<div
			className={`@container h-full w-full flex flex-col gap-3 justify-center items-center py-2 ${
				currentTimer !== 'focus' && 'bg-slate-50'
			}`}
		>
			<h2>{currentTimer === 'focus' ? 'Focus' : 'Break'} Time</h2>
			<div className="font-mono text-4xl @md:text-6xl @lg:text-8xl">
				{getDisplayTime(secondsLeft)}
			</div>
			<div className="flex gap-2 @md:gap-4 @lg:gap-6 text-lg @md:text-2xl @lg:text-3xl">
				<button
					className="rounded hover:bg-slate-200 transition p-2"
					onClick={() => setTimer(timers[currentTimer])}
					title="Reset Current Timer"
				>
					<BackBtn />
				</button>
				<button
					className="rounded hover:bg-slate-200 transition p-2 text-[1.25em]"
					onClick={toggleTimer}
					title={isRunning ? 'Pause' : 'Start'}
				>
					{isRunning ? <PauseBtn /> : <PlayBtn />}
				</button>
				<button
					className="rounded hover:bg-slate-200 transition p-2 text-[1.25em]"
					onClick={handleStop}
					title="Stop - Finished Working"
				>
					<StopBtn />
				</button>
				<button
					className="rounded hover:bg-slate-200 transition p-2"
					onClick={() => getNextTimer()}
					title="Skip Current Timer"
				>
					<ForwardBtn />
				</button>
			</div>
		</div>
	);
}
