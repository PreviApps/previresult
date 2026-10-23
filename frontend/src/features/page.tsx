import { CustomTabs } from "../components/custom_tabs/CustomTabs";


export default function Layout() {

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <main className="flex-1 overflow-auto bg-[#f2fafa] pb-20">
        {/* Aquí renderizas tus vistas o <Outlet /> */}
        {/*<header className="h-14 border-b border-slate-800 flex items-center px-4 gap-4 bg-slate-900/50 backdrop-blur sticky top-0 z-10">

          <span className="text-sm font-medium text-slate-300">Dashboard de Proyectos</span>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }} className="text-sm font-medium text-slate-300">
            Previsalud TI • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </header>*/}
        <CustomTabs></CustomTabs>
      </main>
    </div>
  );
}