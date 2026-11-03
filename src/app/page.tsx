"use client";

import { useState, type SubmitEvent } from "react";
import { trpc } from "@/utils/trpc";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";

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

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
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

      <TaskForm
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        editandoId={editandoId}
        erroForm={erroForm}
        isPending={criarMutation.isPending || atualizarMutation.isPending}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

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
            <TaskItem
              key={t.id}
              tarefa={t}
              onEdit={handleEditar}
              onDelete={(id) =>
                deletarMutation.mutate({ id } satisfies TarefaDeletarInput)
              }
              isDeleting={deletarMutation.isPending}
            />
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
