'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export default function Home() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erroForm, setErroForm] = useState('');

  const utils = trpc.useUtils();

  // 1. Query para listar com suporte a Infinite Scroll (Bônus)
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.task.listar.useInfiniteQuery(
    { limit: 5 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // 2. Mutation para criar tarefa
  const criarMutation = trpc.task.criar.useMutation({
    onSuccess: () => {
      setTitulo('');
      setDescricao('');
      setErroForm('');
      utils.task.listar.invalidate();
    },
    onError: (err) => {
      setErroForm(err.message);
    },
  });

  // 3. Mutation para atualizar tarefa
  const atualizarMutation = trpc.task.atualizar.useMutation({
    onSuccess: () => {
      setTitulo('');
      setDescricao('');
      setEditandoId(null);
      setErroForm('');
      utils.task.listar.invalidate();
    },
    onError: (err) => {
      setErroForm(err.message);
    },
  });

  // 4. Mutation para deletar tarefa
  const deletarMutation = trpc.task.deletar.useMutation({
    onSuccess: () => {
      utils.task.listar.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErroForm('O título é obrigatório.');
      return;
    }
    setErroForm('');

    if (editandoId) {
      atualizarMutation.mutate({ id: editandoId, titulo, descricao });
    } else {
      criarMutation.mutate({ titulo, descricao });
    }
  };

  const handleEditar = (tarefa: { id: string; titulo: string; descricao?: string }) => {
    setEditandoId(tarefa.id);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao || '');
  };

  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setTitulo('');
    setDescricao('');
    setErroForm('');
  };

  return (
    <div className="space-y-8 py-4">
      {/* Cabeçalho */}
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Gerenciador de Tarefas
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Desafio Técnico: Next.js 15, tRPC, Zod & Armazenamento em Memória
        </p>
      </header>

      {/* Formulário de Criação / Edição */}
      <section className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-500 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {editandoId ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>

        {erroForm && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-200">
            {erroForm}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Refatorar rotas do tRPC"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione detalhes sobre esta tarefa..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={criarMutation.isPending || atualizarMutation.isPending}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {editandoId
                ? atualizarMutation.isPending ? 'Salvando...' : 'Salvar Alterações'
                : criarMutation.isPending ? 'Criando...' : 'Criar Tarefa'}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicao}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de Tarefas */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Minhas Tarefas</h2>

        {isLoading && (
          <div className="text-center py-8 text-gray-500 animate-pulse">
            Carregando tarefas do backend...
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
            Erro ao carregar tarefas: {error.message}
          </div>
        )}

        {!isLoading && data?.pages[0]?.tarefas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
            <p className="text-sm text-gray-400 mt-1">Crie a sua primeira tarefa no formulário acima!</p>
          </div>
        )}

        <div className="space-y-3">
          {data?.pages.map((page) =>
            page.tarefas.map((t) => (
              <div
                key={t.id}
                className="bg-amber-300 p-5 rounded-xl border border-amber-100 shadow-sm flex items-start justify-between gap-4 hover:border-gray-200 transition"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-700">{t.titulo}</h3>
                  {t.descricao && <p className="text-sm text-slate-900">{t.descricao}</p>}
                  <span className="text-xs text-slate-700 inline-block pt-1">
                    Criado em: {new Date(t.dataCriacao).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEditar(t)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => deletarMutation.mutate({ id: t.id })}
                    disabled={deletarMutation.isPending}
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition disabled:opacity-50"
                  >
                    {deletarMutation.isPending ? 'Deletando...' : 'Excluir'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botão de Carregar Mais (Infinite Scroll / Paginação) */}
        {hasNextPage && (
          <div className="text-center pt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50 transition"
            >
              {isFetchingNextPage ? 'Carregando mais...' : 'Carregar Mais Tarefas'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}