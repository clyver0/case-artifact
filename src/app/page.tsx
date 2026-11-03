// src/app/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { trpc } from "@/utils/trpc";
import type {
  Tarefa,
  TarefaPagina,
  TarefaCriarInput,
  TarefaAtualizarInput,
  TarefaDeletarInput,
  TarefaListarInput,
} from "@/types/task";

export default function Home() {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erroForm, setErroForm] = useState<string>("");

  const utils = trpc.useUtils();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.task.listar.useInfiniteQuery(
    { limit: 5 } satisfies TarefaListarInput,
    {
      getNextPageParam: (lastPage: TarefaPagina): number | null =>
        lastPage.nextCursor,
    },
  );

  const criarMutation = trpc.task.criar.useMutation({
    onSuccess: () => {
      resetForm();
      utils.task.listar.invalidate();
    },
    onError: (err: { message: string }) => setErroForm(err.message),
  });

  const atualizarMutation = trpc.task.atualizar.useMutation({
    onSuccess: () => {
      resetForm();
      utils.task.listar.invalidate();
    },
    onError: (err: { message: string }) => setErroForm(err.message),
  });
  const deletarMutation = trpc.task.deletar.useMutation({
    onSuccess: () => utils.task.listar.invalidate(),
  });

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setEditandoId(null);
    setErroForm("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErroForm("O título é obrigatório.");
      return;
    }
    setErroForm("");

    if (editandoId) {
      atualizarMutation.mutate({
        id: editandoId,
        titulo,
        descricao,
      } satisfies TarefaAtualizarInput);
    } else {
      criarMutation.mutate({ titulo, descricao } satisfies TarefaCriarInput);
    }
  };

  const handleEditar = (tarefa: Tarefa): void => {
    setEditandoId(tarefa.id);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao ?? "");
  };

  const tarefasLista: Tarefa[] =
    data?.pages.flatMap((page: TarefaPagina): Tarefa[] => page.tarefas) ?? [];

  return (
    <div className="space-y-8 py-4 max-w-2xl mx-auto px-4">
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Gerenciador de Tarefas
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Next.js 15, tRPC, Zod & Armazenamento em Memória
        </p>
      </header>

      {/* Formulário */}
      <section className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-700 space-y-4">
        <h2 className="text-lg font-semibold text-white">
          {editandoId ? "Editar Tarefa" : "Nova Tarefa"}
        </h2>

        {erroForm && (
          <div className="bg-red-950 text-red-300 text-sm p-3 rounded-lg border border-red-800">
            {erroForm}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="titulo"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Título *
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Refatorar rotas do tRPC"
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Descrição (opcional)
            </label>
            <textarea
              id="descricao"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Adicione detalhes..."
              className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={criarMutation.isPending || atualizarMutation.isPending}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {editandoId ? "Salvar Alterações" : "Criar Tarefa"}
            </button>

            {editandoId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Minhas Tarefas</h2>

        {isLoading && (
          <div className="text-center py-8 text-gray-400 animate-pulse">
            Carregando tarefas...
          </div>
        )}
        {isError && (
          <div className="bg-red-950 text-red-300 p-4 rounded-lg border border-red-800">
            Erro: {error.message}
          </div>
        )}

        {!isLoading && tarefasLista.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-700 rounded-xl">
            <p className="text-gray-400">Nenhuma tarefa encontrada.</p>
          </div>
        )}

        <div className="space-y-3">
          {tarefasLista.map((t: Tarefa) => (
            <div
              key={t.id}
              className="bg-amber-300 p-5 rounded-xl shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-slate-900">{t.titulo}</h3>
                {t.descricao && (
                  <p className="text-sm text-slate-700">{t.descricao}</p>
                )}
                <span className="text-xs text-slate-600 inline-block pt-1">
                  Criado em: {new Date(t.dataCriacao).toLocaleString("pt-BR")}
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
                  onClick={() =>
                    deletarMutation.mutate({
                      id: t.id,
                    } satisfies TarefaDeletarInput)
                  }
                  disabled={deletarMutation.isPending}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        {hasNextPage && (
          <div className="text-center pt-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-5 py-2.5 bg-gray-800 text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
            >
              {isFetchingNextPage ? "Carregando..." : "Carregar Mais Tarefas"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
