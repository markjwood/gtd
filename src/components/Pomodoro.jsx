import { useEffect, useRef, useState } from 'react';
import {
	PlayBtn,
	PauseBtn,
	StopBtn,
	BackBtn,
	ForwardBtn,
	GearIcon,
} from '../Icons';
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
const ALARM = new Audio('/timesUp.mp3');

export default function Pomodoro() {
	const [timers, setTimers] = useLocalStorage(LOCALSTORAGE_KEY, DEFAULT_TIMERS);
	const [currentTimer, setCurrentTimer] = useState('focus');
	const [sessionCounter, setSessionCounter] = useState(timers.sessions);
	const [menuIsOpen, setMenuIsOpen] = useState(false);

	const { isRunning, secondsLeft, setTimer, toggleTimer, stop } =
		useCountdown();

	useEffect(() => {
		if (currentTimer === 'focus') {
			setSessionCounter(c => c - 1);
		}
		setTimer(timers[currentTimer]);
	}, [currentTimer, timers]);

	useEffect(() => {
		if (secondsLeft === 0) {
			if (isRunning) {
				getNextTimer();
				ALARM.play();
			} else return () => setCurrentTimer('focus');
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
		});
	}

	function getDisplayTime(seconds) {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor(seconds / 60) - hrs * 60;
		const secs = (seconds % 60).toLocaleString('en-US', {
			minimumIntegerDigits: 2,
		});

		return `${hrs >= 1 ? hrs + ':' : ''}${
			// pad mins to 2 digits only if hours shown
			hrs >= 1
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
			<button
				onClick={() => setMenuIsOpen(true)}
				className="rounded absolute top-[-.75em] right-[-.5em] fill-slate-500 hover:bg-slate-200 transition p-2"
				title="Timer Settings"
			>
				<GearIcon />
			</button>
			<SettingsMenu
				timers={timers}
				setTimers={setTimers}
				isOpen={menuIsOpen}
				setIsOpen={setMenuIsOpen}
			/>
			<div className="font-mono text-4xl @md:text-6xl @lg:text-8xl">
				{getDisplayTime(secondsLeft)}
			</div>
			<div className="flex gap-3 @md:gap-4 @lg:gap-6 text-lg @md:text-2xl @lg:text-3xl">
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

function SettingsMenu({ timers, setTimers, isOpen, setIsOpen }) {
	const modalRef = useRef();

	useEffect(() => {
		if (isOpen) {
			modalRef.current?.showModal();
		} else {
			modalRef.current?.close();
		}
	}, [isOpen]);

	function handleSubmit(e) {
		e.preventDefault();
		setIsOpen(false);
	}

	function handleChange(settingName, val) {
		setTimers(prev => {
			return { ...prev, [settingName]: val };
		});
	}

	function handleModalClick(e) {
		// close modal when clicking outside (on backdrop)
		if (e.target.id === 'modal') setIsOpen(false);
	}

	return (
		<dialog
			id="modal"
			ref={modalRef}
			onClick={handleModalClick}
			onCancel={() => setIsOpen(false)}
			className="shadow rounded-xl"
		>
			<div className="text-center bg-slate-200 py-1">
				<h2 className="font-bold">Timer Settings</h2>
				<p className="text-xs font-extralight italic">Times in minutes</p>
			</div>
			<form className="p-2" onSubmit={handleSubmit}>
				<div className="flex gap-2 justify-between">
					<label htmlFor="focus">Focus time:</label>
					<input
						className="border rounded w-[4em] px-1"
						type="number"
						min="5"
						max="120"
						id="focus"
						value={timers.focus}
						onChange={e => handleChange('focus', e.target.value)}
					/>
				</div>
				<div className="flex gap-3 justify-between mt-1">
					<label htmlFor="shortBreak">Short break time:</label>
					<input
						className="border rounded w-[4em] px-1"
						type="number"
						min="1"
						max="60"
						id="shortBreak"
						value={timers.shortBreak}
						onChange={e => handleChange('shortBreak', e.target.value)}
					/>
				</div>
				<div className="flex gap-3 justify-between mt-1">
					<label htmlFor="longBreak">Long break time:</label>
					<input
						className="border rounded w-[4em] px-1"
						type="number"
						min={Number(timers.shortBreak) + 1}
						max="120"
						id="longBreak"
						value={timers.longBreak}
						onChange={e => handleChange('longBreak', e.target.value)}
					/>
				</div>
				<div className="flex gap-3 justify-between mt-1">
					<label htmlFor="sessions">Sessions between long breaks:</label>
					<input
						className="border rounded w-[4em] px-1"
						type="number"
						min="1"
						max="10"
						id="sessions"
						value={timers.sessions}
						onChange={e => handleChange('sessions', e.target.value)}
					/>
				</div>
				<div className="flex justify-center gap-2 mt-3">
					<button
						className="px-2 py-1 text-slate-800 rounded bg-blue-200 transition hover:bg-cyan-100"
						type="submit"
					>
						Submit
					</button>
					<button
						className="px-2 py-1 rounded bg-slate-500 transition hover:bg-slate-700 text-white"
						type="button"
						onClick={() => setTimers(DEFAULT_TIMERS)}
					>
						Reset to defaults
					</button>
				</div>
			</form>
		</dialog>
	);
}
