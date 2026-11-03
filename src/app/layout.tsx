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
      <body className="bg-gray-950 text-gray-900 min-h-screen w-full">
        <TRPCProvider>
          <main className="w-full bg-gray-950 flex items-center justify-center">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}