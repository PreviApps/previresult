import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CustomSheet } from "../../../../components/custom_sheet/CustomSheet";
import type { LaboratoriesDetailsSheetProps } from "./laboratories-details-sheet-types";
import { LaboratoriesPDF } from "../laboratories_pdf/LaboratoriesPDF";

export const LaboratoriesDetailsSheet: React.FC<LaboratoriesDetailsSheetProps> = ({
  isOpen,
  onClose,
  laboratorie
}) => {

  if (!laboratorie) return null;

  return (
    <CustomSheet isOpen={isOpen} onClose={onClose}>
      {/* Contenedor principal en columna que ocupa al menos toda la altura */}
      <div className="flex flex-col min-h-full">
        
        {/* SECCIÓN SUPERIOR (Contenido que puede crecer y hacer scroll) */}
        <div className="flex-1 space-y-4 pr-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-foreground text-xl leading-tight">
              {laboratorie.paciente.nombre_paciente}
            </h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exámenes ordenados:</p>
            {laboratorie.examenes.map((lab, index) => (
              <div key={index} className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                <span className="text-sm font-medium text-slate-700">
                  - {lab.nombreExamen}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER / BOTÓN AL FINAL DE TODO EL SCROLL */}
        <div className="pt-6 mt-6 border-t border-slate-100 bg-white">
          <PDFDownloadLink
            document={<LaboratoriesPDF laboratorie={laboratorie} />}
            fileName={`resultado_lab_${laboratorie.paciente.num_documento}.pdf`}
            className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {({ loading }) => (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {loading ? 'Generando...' : 'Descargar PDF'}
              </>
            )}
          </PDFDownloadLink>
        </div>

      </div>
    </CustomSheet>
  );
};