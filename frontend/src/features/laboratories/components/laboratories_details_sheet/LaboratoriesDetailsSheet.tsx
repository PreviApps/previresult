import React from 'react';
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { CustomSheet } from "../../../../components/custom_sheet/CustomSheet";
import type { LaboratoriesDetailsSheetProps } from "./laboratories-details-sheet.types";
import { LaboratoriesPDF } from "../laboratories_pdf/LaboratoriesPDF";
import { useLaboratorySignatures } from "../../hooks/useLaboratorySignatures";

export const LaboratoriesDetailsSheet: React.FC<LaboratoriesDetailsSheetProps> = ({
  isOpen,
  onClose,
  laboratorie
}) => {

  // Las firmas se cargan aquí (en React DOM) y se pasan ya resueltas al PDF
  const { signatures, loading: isSignaturesLoading } = useLaboratorySignatures(laboratorie);

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
          {isSignaturesLoading ? (
            <button
              disabled
              className="w-full px-4 py-2.5 bg-slate-300 text-slate-600 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Cargando firmas de médicos...
            </button>
          ) : (
            <div className="flex gap-2">
            <BlobProvider document={<LaboratoriesPDF laboratorie={laboratorie} signatures={signatures} />}>
              {({ url, loading }) => (
                <button
                  type="button"
                  disabled={loading || !url}
                  onClick={() => url && window.open(url, '_blank')}
                  className="flex-1 px-4 py-2.5 border border-teal-600 text-teal-700 hover:bg-teal-50 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {loading ? 'Generando...' : 'Ver PDF'}
                </button>
              )}
            </BlobProvider>
            <PDFDownloadLink
              document={<LaboratoriesPDF laboratorie={laboratorie} signatures={signatures} />}
              fileName={`resultado_lab_${laboratorie.paciente.num_documento}.pdf`}
              className="flex-1 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
            >
              {({ loading }) => (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {loading ? 'Generando PDF...' : 'Descargar PDF'}
                </>
              )}
            </PDFDownloadLink>
            </div>
          )}
        </div>

      </div>
    </CustomSheet>
  );
};