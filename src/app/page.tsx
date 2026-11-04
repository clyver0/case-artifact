// src/app/page.tsx
"use client";

import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { useTasksController } from "@/hooks/useTasksController";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Tarefa } from "@/types/task";

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

  // Utilizando o hook customizado de Infinite Scroll
  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  return (
    <div className="max-w-4xl flex flex-col gap-8 justify-center py-10 px-4 sm:px-6 w-full mx-auto">
      {/* Cabeçalho */}
      <header className="border-b border-gray-800/80 pb-6 space-y-2">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <h1 className="text-3xl font-extrabold  text-white">
            Gerenciador de Tarefas
          </h1>
        </div>
        <p className=" text-gray-400 font-normal">
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
     
          <h2 className="font-bold  flex items-center gap-2 w-full text-indigo-100 text-3xl">
            Minhas Tarefas
          </h2>
   
  

        {isLoading && (
          <div className="text-center py-12 bg-gray-900/50 rounded-2xl border border-gray-800/65">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mb-3"></div>
            <p className=" text-gray-400">
              Carregando tarefas do servidor...
            </p>
          </div>
        )}

        {isError && (
          <div className="bg-red-950/80 text-red-300 p-4 rounded-xl border border-red-900/50  flex items-center gap-3">
            <div>
              <p className="font-bold">Erro ao carregar dados</p>
              <p className="text-red-400  mt-0.5">{error?.message}</p>
            </div>
          </div>
        )}

        {!isLoading && tarefasLista.length === 0 && (
          <div className="text-center py-14 border border-dashed border-gray-800 rounded-2xl bg-gray-900/30">
            <span className="text-3xl block mb-2"></span>
            <p className="text-gray-300 font-medium">
              Nenhuma tarefa encontrada
            </p>
            <p className=" text-gray-500 mt-1">
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

        {/* Elemento Sentinela Conectado ao Hook */}
        <div ref={loadMoreRef} className="py-6 text-center">
          {isFetchingNextPage && (
            <div className="inline-flex items-center gap-2  text-gray-400 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800">
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></span>
              Carregando mais tarefas...
            </div>
          )}
          {!hasNextPage && tarefasLista.length > 0 && (
            <p className="text-white font-medium">
              Você chegou ao fim da lista.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}