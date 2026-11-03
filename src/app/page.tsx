// src/app/page.tsx
"use client";

import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { useTasksController } from "@/hooks/useTasksController";
import type { Tarefa, TarefaDeletarInput } from "@/types/task";

export default function Home() {
  const {
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    editandoId,
    erroForm,
    tarefasLista,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isPending,
    isDeleting,
    handleSubmit,
    handleEditar,
    resetForm,
    deletarTarefa,
  } = useTasksController();

  return (
    <div className="max-w-4xl flex flex-col gap-8 justify-center py-10 px-4 sm:px-6 w-full mx-auto">
      {/* Cabeçalho */}
      <header className="border-b border-gray-800/80 pb-6 space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Gerenciador de Tarefas
          </h1>
        </div>
        <p className="text-sm text-gray-400 font-normal">
          Desafio Técnico com Next.js 15, tRPC, Zod & Armazenamento em Memória
        </p>
      </header>

      {/* Formulário */}
      <TaskForm
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        editandoId={editandoId}
        erroForm={erroForm}
        isPending={isPending}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

      {/* Seção da Lista de Tarefas */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            Minhas Tarefas
          </h2>
          {tarefasLista.length > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-400">
              {tarefasLista.length}{" "}
              {tarefasLista.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-800/65">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mb-3"></div>
            <p className="text-sm text-gray-400">
              Carregando tarefas do servidor...
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-950/80 text-red-300 p-4 rounded-xl border border-red-900/50 text-sm flex items-center gap-3">
            <div>
              <p className="font-semibold">Erro ao carregar dados</p>
              <p className="text-red-400 text-xs mt-0.5">{error.message}</p>
            </div>
          </div>
        )}

        {!isLoading && tarefasLista.length === 0 && (
          <div className="text-center py-14 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
            <span className="text-3xl block mb-2">📥</span>
            <p className="text-gray-300 font-medium">
              Nenhuma tarefa encontrada
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Crie a sua primeira tarefa no formulário acima.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {tarefasLista.map((t: Tarefa) => (
            <TaskItem
              key={t.id}
              tarefa={t}
              onEdit={handleEditar}
              onDelete={(id) => deletarTarefa(id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className="text-center pt-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 font-medium text-sm rounded-xl border border-gray-800 hover:border-gray-700 disabled:opacity-50 transition shadow-sm active:scale-[0.98] cursor-pointer"
            >
              {isFetchingNextPage ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-gray-300 border-t-transparent"></span>
                  Carregando...
                </span>
              ) : (
                "Carregar Mais Tarefas"
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
