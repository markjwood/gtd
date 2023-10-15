export default function Card({ children, title }) {
	return (
		<div className="mt-6 bg-white outline-slate-800 rounded-xl shadow grow">
			{title && (
				<h2 className="text-center text-slate-700 bg-sky-100 text-xl font-bold rounded-t-xl">
					{title}
				</h2>
			)}
			<div className="px-5 py-6">{children}</div>
		</div>
	);
}
