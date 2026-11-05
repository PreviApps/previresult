import { CustomSheet } from "../../../components/custom_sheet/CustomSheet";
import { formatDate } from "../../../utils/date.helper";
import { cleanHtmlReport } from "../../../utils/html.helper";
import { useDiagnosticImageDetails } from "../hooks/useDiagnosticImageDetails";
import { useDiagnosticImageDICOM } from "../hooks/useDiagnosticImageDICOM";
import { useDiagnosticPDF } from "../hooks/useDiagnosticPDF";
import type { DiagnosticImagesDetailsSheetProps } from "./diagnostic-images-details-sheet.types";

export const DiagnosticImagesDetailsSheet: React.FC<DiagnosticImagesDetailsSheetProps> = ({
  isOpen,
  onClose,
  reportImage
}) => {

  if (!reportImage) return null;

  const { details, loading, error } = useDiagnosticImageDetails(reportImage.report_id, isOpen);
  const { handleOpenPdf, loadingPdf } = useDiagnosticPDF();
  const { handleOpenDicom, loadingDicom } = useDiagnosticImageDICOM();

  const hasReport = reportImage.report_id !== null && reportImage.report_id !== undefined;
  const isCanceled = reportImage.state === "canceled";
  const hasPacsUid = Boolean(reportImage.pacs_uid);

  // Verificamos que ya no esté cargando los detalles y que no haya error
  const isReady = !loading && !error && details !== null;
  const canOpenPdf = hasReport && !isCanceled && isReady && !loadingPdf;

  const handleViewPDF = () => {
    if (!hasReport || !reportImage.report_id) return;
    handleOpenPdf(reportImage.report_id);
  };

  const handleViewDicom = () => {
    if (!hasPacsUid || !reportImage.report_id) return;
    handleOpenDicom(reportImage.code, reportImage.pacs_uid);
  };

  return (
    <CustomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col min-h-full">

        <div className="flex-1 space-y-4 pr-6">

          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-foreground text-xl leading-tight">
              {reportImage.patient_details.first_name} {reportImage.patient_details.last_name}
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reporte de EDX:</p>
            {reportImage.clinical_info ? (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs">
                <p className="text-blue-800">{reportImage.clinical_info}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Sin información clínica registrada</p>
            )}

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
              <div>
                <span className="font-medium text-slate-400 block">No. de Orden:</span>
                <span className="text-slate-700 font-semibold">{reportImage.code}</span>
              </div>
              <div>
                <span className="font-medium text-slate-400 block">Estado:</span>
                <span className={`font-semibold capitalize px-2 py-0.5 rounded inline-block mt-0.5 ${isCanceled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {reportImage.state}
                </span>
              </div>
              <div>
                <span className="font-medium text-slate-400 block">Fecha de Creación:</span>
                <span className="text-slate-700">{formatDate(reportImage.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalles del Reporte:</p>

            {loading ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg">Cargando detalles del reporte...</p>
            ) : error ? (
              <p className="text-xs text-red-500 p-3 bg-red-50 rounded-lg">{error}</p>
            ) : details ? (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs space-y-2">
                <p className="text-blue-900 font-medium">Información clínica / Diagnóstico:</p>
                <p className="text-black-800">{cleanHtmlReport(details.report.text) || "Sin descripción adicional"}</p>
                {/*<p className="text-blue-800" dangerouslySetInnerHTML={{__html: details.report.text}}></p>*/}
                {/* Pinta aquí los campos específicos que traiga 'details' */}
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-500 italic">
                {hasReport ? "No hay información adicional disponible." : "Reporte no disponible para esta orden."}
              </div>
            )}
          </div>

        </div>

        <div data-tour="img-actions" className="pt-6 mt-6 border-t border-slate-100 bg-white">

          <button
            onClick={handleViewPDF}
            disabled={!canOpenPdf}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-2 ${canOpenPdf
                ? 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
          >
            {loadingPdf
              ? 'Generando PDF...'
              : loading
                ? 'Cargando detalles...'
                : (hasReport ? 'Ver Reporte en PDF' : 'Reporte no disponible')}
          </button>

          {/* Botón para ver Imágenes DICOM */}
          <button
            onClick={handleViewDicom}
            disabled={!hasPacsUid || isCanceled || loadingDicom}
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-2 ${hasPacsUid && !isCanceled && !loadingDicom
              ? 'border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer'
              : 'border border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
          >
            {loadingDicom ? 'Cargando visor PACS...' : 'Ver Imágenes DICOM'}
          </button>

        </div>
      </div>
    </CustomSheet>
  )

}