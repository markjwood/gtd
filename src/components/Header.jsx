export default function Header() {
	return (
		<header className="px-4 md:px-8 py-6 mb-8 bg-cyan-800 text-slate-50">
			<div className="container mx-auto flex justify-between gap-2">
				<h1 className="text-2xl md:text-4xl font-bold">GTD</h1>
				<nav className="flex items-center">
					<ul className="flex gap-2 items-center">
						<li>
							<a
								className="underline decoration-transparent hover:decoration-current hover:text-cyan-300 transition"
								href="#"
							>
								Home
							</a>
						</li>
						<li>
							<a
								className="underline decoration-transparent hover:decoration-current hover:text-cyan-300 transition"
								href="#"
							>
								About
							</a>
						</li>
						<li>
							<a
								className="underline decoration-transparent hover:decoration-current hover:text-cyan-300 transition"
								href="#"
							>
								Contact
							</a>
						</li>
						{/* <li className="ml-4">
              // replace with hamburger menu
							<button>||</button>
						</li> */}
					</ul>
				</nav>
			</div>
		</header>
	);
}
