import { type SubmitEvent } from "react";
import type { SubmitEventHandler } from 'react';

interface TaskFormProps {
  titulo: string;
  setTitulo: (val: string) => void;
  descricao: string;
  setDescricao: (val: string) => void;
  editandoId: string | null;
  erroForm: string;
  isPending: boolean;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onCancel: () => void;
}

export function TaskForm({
  titulo,
  setTitulo,
  descricao,
  setDescricao,
  editandoId,
  erroForm,
  isPending,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  return (
    <section className="bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-700 space-y-4">
      <h2 className="text-lg font-semibold text-white">
        {editandoId ? "Editar Tarefa" : "Nova Tarefa"}
      </h2>

      {erroForm && (
        <div className="bg-red-950 text-red-300 text-sm p-3 rounded-lg border border-red-800">
          {erroForm}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
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
            disabled={isPending}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {editandoId ? "Salvar Alterações" : "Criar Tarefa"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
