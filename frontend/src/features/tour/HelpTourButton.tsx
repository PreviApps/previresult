import { resetTours, startGeneralTour } from './tours';

export const HelpTourButton = () => (
  <button
    type="button"
    title="Ver guía"
    aria-label="Ver guía de uso"
    onClick={() => { resetTours(); startGeneralTour(true); }}
    className="w-10 h-10 rounded-full border border-teal-600 text-teal-700 hover:bg-teal-50 font-bold transition"
  >
    ?
  </button>
);
