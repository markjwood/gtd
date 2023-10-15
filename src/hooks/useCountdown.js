import { useEffect, useState } from 'react';

export default function useCountdown() {
	const [secondsLeft, setSecondsLeft] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		if (!isRunning) return;
		if (secondsLeft <= 0) {
			setSecondsLeft(0);
			return;
		}

		const countdown = setTimeout(() => {
			setSecondsLeft(prev => prev - 1);
		}, 10);

		return () => clearTimeout(countdown);
	}, [secondsLeft, isRunning]);

	function setTimer(mins) {
		setSecondsLeft(mins * 60);
	}

	function toggleTimer() {
		if (isRunning) {
			setIsRunning(false);
			return;
		}

		setIsRunning(true);
	}

	function stop() {
		setIsRunning(false);
		setTimer(0);
	}

	return { isRunning, secondsLeft, setTimer, toggleTimer, stop };
}
