import { Tabs, type DateRange } from "@heroui/react";
import { ImagesView } from "../../features/diagnostic-images/views/DiagnosticImages";
import { LaboratoriesView } from "../../features/laboratories/views/Laboratories";
import { CustomDateRange } from "../custom_date_range/CustomDateRange";
import { useLaboratories } from "../../features/laboratories/hooks/useLaboratories";

export const CustomTabs = () => {

  const { laboratories, loading, error, hasSearched, fetchLaboratories } = useLaboratories();

  const handleSearch = (range: DateRange | null) => {
    if (range) {
      fetchLaboratories(range);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-12 pt-6 pb-4 gap-4 border-b border-slate-200 bg-white/40 backdrop-blur-md sticky top-0 z-20">
        <div className="w-full sm:w-auto">
          <CustomDateRange onSearch={handleSearch} />
        </div>
      </div>

      <Tabs className="w-full text-black p-12" variant="secondary">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Options">
            <Tabs.Tab id="diagnostic-images">
              Imágenes
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="laboratories">
              Laboratorios
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4" id="diagnostic-images">
          <ImagesView></ImagesView>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="laboratories">
          <LaboratoriesView
            hasSearched={hasSearched}
            error={error}
            loading={loading}
            laboratories={laboratories}>
          </LaboratoriesView>
        </Tabs.Panel>
      </Tabs>
    </>
  )
}