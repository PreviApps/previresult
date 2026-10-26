import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { ILaboratories } from '../../types/laboratories.types';
import previsaludLogo from '../../../../assets/previsalud.png';
import { useSignature } from '../../../signatures/hooks/useSignature';

// Estilos avanzados trasladados de Tailwind CSS a React-PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#0f172a', // slate-900
    backgroundColor: '#ffffff'
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: 'contain',
  },

  // ENCABEZADO INSTITUCIONAL
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a', // border-slate-900
    paddingBottom: 8,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a', // text-blue-900
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569', // text-slate-600
    textTransform: 'uppercase',
    marginTop: 1,
  },
  companyName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b', // text-slate-800
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  companyAddress: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'right',
    marginTop: 2,
  },
  orderBadge: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
    marginTop: 4,
  },
  pageNumber: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 2,
  },

  // GRILLA DE INFORMACIÓN DEL PACIENTE
  patientCard: {
    backgroundColor: '#f8fafc', // bg-slate-50
    borderColor: '#e2e8f0', // border-slate-200
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  gridCol: {
    flexDirection: 'row',
    width: '50%',
  },
  label: {
    width: 90,
    fontWeight: 'bold',
    color: '#334155', // text-slate-700
    fontSize: 7,
  },
  value: {
    flex: 1,
    color: '#0f172a',
    fontSize: 8,
  },
  valueBold: {
    flex: 1,
    color: '#0f172a',
    fontSize: 8,
    fontWeight: 'bold',
  },
  valueHighlight: {
    flex: 1,
    color: '#1e3a8a', // blue-900
    fontSize: 8,
    fontWeight: 'bold',
  },

  // TABLA DE RESULTADOS
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', // bg-slate-100
    borderBottomWidth: 2,
    borderBottomColor: '#334155', // border-slate-700
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  thText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase',
  },

  // Categorías (Ej: QUIMICA)
  categoryRow: {
    backgroundColor: '#e2e8f0', // bg-slate-200
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  categoryTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },

  // Filas de Analitos
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
  },

  // Ancho de Columnas
  colAnalite: { width: '40%' },
  colResult: { width: '20%', textAlign: 'center' },
  colUnit: { width: '15%', textAlign: 'center' },
  colRef: { width: '25%' },

  analiteText: { fontSize: 8, fontWeight: 'medium', color: '#0f172a' },
  resultText: { fontSize: 9, fontWeight: 'bold', color: '#0f172a' },
  unitText: { fontSize: 8, color: '#334155' },
  refText: { fontSize: 7, color: '#475569' },

  // FIRMA Y SELLO
  footerSection: {
    marginTop: 'auto',
    paddingTop: 15,
  },
  signatureWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  signatureBox: {
    width: 200,
    alignItems: 'center',
  },
  signatureLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#0f172a',
    marginTop: 4, // Espacio para que la firma repose sobre la línea
    marginBottom: 4, // Espacio entre la línea y el nombre del doctor
    paddingTop: 2,
  },
  profName: { fontSize: 8, fontWeight: 'bold', color: '#0f172a', textTransform: 'uppercase' },
  profTitle: { fontSize: 7, fontWeight: 'bold', color: '#334155', textTransform: 'uppercase' },
  profDetail: { fontSize: 7, color: '#64748b' },

  // NOTA LEGAL
  disclaimerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 4,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 7,
    fontStyle: 'italic',
    color: '#475569',
    textAlign: 'center',
  }
});

interface LaboratoriesPDFProps {
  laboratorie: ILaboratories;
}

export const LaboratoriesPDF: React.FC<LaboratoriesPDFProps> = ({ laboratorie }) => {
  const { paciente, fechaSolicitud, nom_entidad, examenes } = laboratorie;
  const { fetchSignature } = useSignature();
  // Estado para almacenar las firmas indexadas por el ID del profesional (usrCodigo)
  const [signatures, setSignatures] = useState<Record<string, { firma: string, profesion: string | null }>>({});

  // Función auxiliar para agrupar las líneas de referencia (V o F) en el analito principal
  const groupAnalytesWithReferences = (resultados: any[]) => {
    const rows: any[] = [];
    let currentAnalytic: any = null;

    for (const item of (resultados || [])) {
      const isRef = item.unidadMedida === 'V' || item.unidadMedida === 'F';

      if (isRef) {
        if (currentAnalytic) {
          currentAnalytic.refLines = currentAnalytic.refLines || [];
          if (item.nombreAnalito && item.nombreAnalito.trim()) {
            currentAnalytic.refLines.push(item.nombreAnalito.trim());
          }
        }
      } else {
        currentAnalytic = {
          ...item,
          refLines: item.valorReferencia && item.valorReferencia !== ' - '
            ? [item.valorReferencia.trim()]
            : []
        };
        rows.push(currentAnalytic);
      }
    }

    return rows;
  };

  // Agrupamos los exámenes por nombreProfesional de forma dinámica
  const doctorGroupsMap = (examenes || []).reduce((acc: any, exam: any) => {
    const docName = exam.nombreProfesional || 'MEDICO GENERAL';
    if (!acc[docName]) {
      acc[docName] = {
        nombreProfesional: docName,
        idProfesional: exam.idProfesional,
        fechaResultado: exam.fechaResultado,
        horaResultado: exam.horaResultado,
        examenes: []
      };
    }
    acc[docName].examenes.push(exam);
    return acc;
  }, {});

  const doctorGroups = Object.values(doctorGroupsMap) as any[];

  // Efecto para consultar las firmas de cada médico único presente en los exámenes
  useEffect(() => {
    const loadSignatures = async () => {
      const newSignatures: Record<string, { firma: string; profesion: string | null }> = {};

      for (const group of doctorGroups) {
        if (group.idProfesional) {
          const data = await fetchSignature(group.nombreProfesional); // ¡Sin mandar instancia! El backend busca en las 3.
          if (data) {
            newSignatures[group.idProfesional] = {
              firma: data.firma || '',
              profesion: data.profesion || null,
            };
          }
        }
      }
      setSignatures(newSignatures);
    };

    if (doctorGroups.length > 0) {
      loadSignatures();
    }
  }, [laboratorie]);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* ────────── BLOQUE FIJO: SOLO LO QUE SE REPITE EN CADA PÁGINA ────────── */}
        <View fixed>
          {/* ENCABEZADO INSTITUCIONAL */}
          <View style={styles.headerContainer}>
            <View>
              <Image
                style={styles.logo}
                src={previsaludLogo}
              />
            </View>
            <View>
              <Text style={styles.companyName}>LABORATORIO CLINICO PREVISALUD</Text>
              <Text style={styles.companyAddress}>CALLE 18 N° 12-83 GAITAN</Text>
              <Text style={styles.orderBadge}>
                ORDEN N°: <Text style={{ fontSize: 9 }}>{laboratorie.id}</Text>
              </Text>
              <Text
                style={styles.pageNumber}
                render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
              />
            </View>
          </View>

          {/* GRILLA DE INFORMACIÓN DEL PACIENTE Y ORDEN */}
          <View style={styles.patientCard}>
            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Order No.:</Text>
                <Text style={styles.valueBold}>{laboratorie.id}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Fecha Ingreso:</Text>
                <Text style={styles.value}>{fechaSolicitud}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Paciente:</Text>
                <Text style={styles.valueBold}>{paciente?.nombre_paciente}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Fecha Impresión:</Text>
                <Text style={styles.value}>{new Date().toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Identificación:</Text>
                <Text style={styles.value}>{paciente?.tipo_documento} {paciente?.num_documento}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Convenio:</Text>
                <Text style={styles.valueHighlight}>{nom_entidad}</Text>
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Código Entidad:</Text>
                <Text style={styles.value}>{laboratorie.cod_entidad}</Text>
              </View>
              <View style={styles.gridCol}>
                <Text style={styles.label}>Sede:</Text>
                <Text style={styles.value}>SEDE PRINCIPAL CALIDAD MEDICA</Text>
              </View>
            </View>
          </View>

          {/* ENCABEZADOS DE COLUMNA DE LA TABLA (SE REPITEN ARRIBA) */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colAnalite, styles.thText]}>ANALITO</Text>
            <Text style={[styles.colResult, styles.thText]}>RESULTADO</Text>
            <Text style={[styles.colUnit, styles.thText]}>UNIDADES</Text>
            <Text style={[styles.colRef, styles.thText]}>VALORES DE REFERENCIA</Text>
          </View>
        </View>
        {/* ────────── AQUÍ TERMINA LO FIJO Y COMIENZA EL FLUJO NORMAL ────────── */}


        {/* ────────── CONTENIDO DINÁMICO (FLUYE LIBREMENTE ENTRE PÁGINAS) ────────── */}
        <View>
          {doctorGroups.map((group: any, groupIdx: number) => (
            <View key={groupIdx}>

              {/* Mapeo de exámenes de este especialista */}
              {group.examenes.map((exam: any, examIdx: number) => {
                const processedResults = groupAnalytesWithReferences(exam.resultado);

                return (
                  /* wrap={false} evita que el examen se parta a mitad de página */
                  <View key={exam.id_examen || examIdx} wrap={false}>

                    {/* Barra de Categoría / Nombre Examen */}
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryTitle}>
                        {exam.nombreExamen} {exam.cod_cups ? `(CUPS: ${exam.cod_cups})` : ''}
                      </Text>
                    </View>

                    {/* Mapeo de Analitos consolidados */}
                    {processedResults.map((res: any, resIdx: number) => (
                      <View key={res.codigoAnalito || resIdx} style={styles.tableRow}>
                        <Text style={[styles.colAnalite, styles.analiteText]}>
                          {res.nombreAnalito}
                        </Text>
                        <Text style={[styles.colResult, styles.resultText]}>
                          {res.resultado}
                        </Text>
                        <Text style={[styles.colUnit, styles.unitText]}>
                          {res.unidadMedida === 'V' || res.unidadMedida === 'F' ? '' : res.unidadMedida}
                        </Text>
                        <Text style={[styles.colRef, styles.refText]}>
                          {res.refLines && res.refLines.length > 0
                            ? res.refLines.join('\n')
                            : ' - '}
                        </Text>
                      </View>
                    ))}

                  </View>
                );
              })}

              {/* FIRMA CORRESPONDIENTE A ESTE MÉDICO */}
              <View wrap={false} style={styles.footerSection}>
                <View style={styles.signatureWrapper}>
                  <View style={styles.signatureBox}>
                    {/* Pintamos la firma en Base64 si ya fue cargada para este profesional */}
                    {signatures[group.idProfesional]?.firma && (
                      <Image
                        src={signatures[group.idProfesional].firma}
                        style={{ width: 120, height: 45, objectFit: 'contain', marginBottom: 4 }}
                      />
                    )}
                    <View style={styles.signatureLine} />
                    <Text style={styles.profName}>{group.idProfesional}</Text>
                    <Text style={styles.profTitle}>{signatures[group.idProfesional]?.profesion}</Text>
                    <Text style={styles.profDetail}>RP / Registro:</Text>
                    <Text style={styles.profDetail}>
                      Validación: {group.fechaResultado} {group.horaResultado}
                    </Text>
                  </View>
                </View>
              </View>

            </View>
          ))}
        </View>

        {/* Disclaimer Legal */}
        <View wrap={false} style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            "La interpretación de este y todo examen de Laboratorio corresponde exclusivamente al médico"
          </Text>
        </View>

      </Page>
    </Document>
  );
};