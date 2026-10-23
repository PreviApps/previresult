// src/components/custom_card/CustomCard.tsx
import React from 'react';
import type { CustomCardProps } from './custom-card.types';

export const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  children,
  onClick,
}) => {

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full flex-col rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {/* Cabecera: Título y Punto de Estado */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-slate-900">{title}</h3>
      </div>

      {/* Descripción */}
      {description && (
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-600">
          {description}
        </p>
      )}

      {/* Sección Inferior: Avance y Detalles */}
      <div className="mt-auto pt-4 w-full">

        {/* Footer */}
        {/*{footerContent && <div className="mt-3 text-slate-600">{footerContent}</div>}*/}
        {children && <div className="mt-auto pt-4 w-full">{children}</div>}
      </div>
    </button>
  );
};