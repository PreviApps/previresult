import { logoutSession } from "../../core/auth/auth";

export const LogoutButton = () => {
  const handleLogout = async () => {
    await logoutSession();
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
    >
      Cerrar Sesión
    </button>
  );
};