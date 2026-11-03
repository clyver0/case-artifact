import './globals.css';
import TRPCProvider from '@/utils/trpc-provider';

export const metadata = {
  title: 'Gerenciador de Tarefas tRPC',
  description: 'Teste prático Next.js 15 e tRPC',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <TRPCProvider>
          <main className="max-w-3xl mx-auto p-6">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}