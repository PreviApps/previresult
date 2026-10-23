import React from 'react';
import type { CustomSheetProps } from './custom-sheet.types';

export const CustomSheet: React.FC<CustomSheetProps> = ({
	isOpen,
	onClose,
	children,
	maxWidth = 'sm:max-w-xl',
}) => {
	if (!isOpen) return null;

	return (
		<div className="relative z-50">
			{/* Fondo oscuro opaco (Backdrop) */}
			<div
				data-state={isOpen ? 'open' : 'closed'}
				className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
				style={{ pointerEvents: 'auto' }}
				aria-hidden="true"
				onClick={onClose}
			/>

			{/* Contenedor del Sidebar Deslizante */}
			<div
				role="dialog"
				data-state={isOpen ? 'open' : 'closed'}
				className={`fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right w-full overflow-y-auto ${maxWidth}`}
				tabIndex={-1}
				style={{ pointerEvents: 'auto' }}
			>
				{/* Botón Cerrar (X) */}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary text-slate-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<path d="M18 6 6 18"></path>
						<path d="m6 6 12 12"></path>
					</svg>
					<span className="sr-only">Close</span>
				</button>

				{/* Contenido inyectado */}
				{children}
			</div>
		</div>
	);
};