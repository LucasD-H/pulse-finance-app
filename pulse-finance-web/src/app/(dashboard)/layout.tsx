import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { RequireAuth } from "@/components/require-auth";

// Todo o conteúdo deste grupo de rotas é protegido por autenticação
// verificada no client (via localStorage), então ele nunca produz um shell
// estático de verdade no servidor — isso é intencional, então desativamos a
// validação de "instant navigation" do Next.js para essas rotas.
export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="min-h-screen">
        <Sidebar />
        <div className="flex flex-col md:pl-64">
          <Topbar />
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
