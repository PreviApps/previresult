import { driver, type Driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

type TourKey = 'general' | 'labs' | 'images';
const PREFIX = 'previresult:tour:';

const wasSeen = (k: TourKey) => {
  try { return localStorage.getItem(PREFIX + k) === '1'; } catch { return false; }
};
const markSeen = (k: TourKey) => {
  try { localStorage.setItem(PREFIX + k, '1'); } catch { /* sin storage */ }
};
export const resetTours = () => {
  try {
    (['general', 'labs', 'images'] as TourKey[]).forEach(k => localStorage.removeItem(PREFIX + k));
  } catch { /* sin storage */ }
};

// Espera a que aparezca un elemento (p. ej. el panel lateral tras abrir una tarjeta)
const waitFor = (selector: string, timeout = 3000) =>
  new Promise<void>(resolve => {
    const start = performance.now();
    const check = () => {
      if (document.querySelector(selector) || performance.now() - start > timeout) return resolve();
      requestAnimationFrame(check);
    };
    check();
  });

// Paso que, al pulsar "Siguiente", abre la tarjeta y espera a que cargue el panel
const openCardStep = (cardSel: string, nextSel: string, title: string, description: string): DriveStep => ({
  element: cardSel,
  popover: {
    title,
    description,
    onNextClick: async (_el, _step, { driver: d }) => {
      document.querySelector<HTMLElement>(cardSel)?.click();
      await waitFor(nextSel);
      d.moveNext();
    },
  },
});

// En los pasos dentro del panel no se permite "Anterior" (el panel tapa las tarjetas)
const inSheet = (element: string, title: string, description: string): DriveStep => ({
  element,
  popover: { title, description, showButtons: ['next', 'close'] },
});

let active: Driver | null = null;

const run = (key: TourKey, steps: DriveStep[], force = false) => {
  if (active?.isActive()) return;
  if (!force && wasSeen(key)) return;
  active = driver({
    showProgress: true,
    progressText: '{{current}} de {{total}}',
    nextBtnText: 'Siguiente',
    prevBtnText: 'Anterior',
    doneBtnText: 'Entendido',
    steps,
    onDestroyed: () => { markSeen(key); active = null; },
  });
  active.drive();
};

export const startGeneralTour = (force = false) => run('general', [
  { element: '[data-tour="tab-labs"]', popover: { title: 'Resultados de laboratorio', description: 'Aquí encuentras los resultados de tus exámenes de laboratorio.' } },
  { element: '[data-tour="tab-images"]', popover: { title: 'Imágenes diagnósticas', description: 'Aquí encuentras los reportes de tus imágenes diagnósticas.' } },
  { element: '[data-tour="date-range"]', popover: { title: 'Rango de fechas', description: 'Selecciona la fecha inicial y final para consultar tus resultados de laboratorio.' } },
  { element: '[data-tour="search-btn"]', popover: { title: 'Consultar', description: 'Pulsa aquí para buscar los resultados del rango seleccionado.' } },
], force);

export const startLabsTour = () => run('labs', [
  { element: '[data-tour="lab-list"]', popover: { title: 'Resultados por órdenes', description: 'Tus resultados se agrupan por orden de laboratorio.' } },
  openCardStep('[data-tour="lab-card"]', '[data-tour="lab-exams"]', 'Ver detalles', 'Haz click en una orden para ver sus detalles.'),
  inSheet('[data-tour="lab-exams"]', 'Exámenes', 'Aquí se listan los exámenes de la orden.'),
  inSheet('[data-tour="lab-actions"]', 'Ver o descargar', 'Puedes ver el resultado en PDF o descargarlo.'),
]);

export const startImagesTour = () => run('images', [
  { element: '[data-tour="img-list"]', popover: { title: 'Resultados por órdenes', description: 'Tus reportes de imágenes se agrupan por orden.' } },
  openCardStep('[data-tour="img-card"]', '[data-tour="img-actions"]', 'Ver detalles', 'Haz click en una orden para ver sus detalles.'),
  inSheet('[data-tour="img-actions"]', 'Ver resultados', 'Puedes ver el reporte en PDF o abrir las imágenes DICOM.'),
]);
