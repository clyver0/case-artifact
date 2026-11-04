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
    <section className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 space-y-5">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h2 className="text-base font-semibold text-gray-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {editandoId ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
      </div>

      {erroForm && (
        <div className="bg-red-950/80 text-red-300 text-sm p-3.5 rounded-xl border border-red-900/50 flex items-center gap-2">
          <span>Erro: </span> {erroForm}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="titulo"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"
          >
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Refatorar rotas do tRPC"
            className="w-full px-4 py-2.5 bg-gray-950 text-gray-100 placeholder-gray-600 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"
          >
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Adicione detalhes sobre a tarefa..."
            className="w-full px-4 py-2.5 bg-gray-950 text-gray-100 placeholder-gray-600 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition text-sm resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="button"
          >
            {isPending ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Tarefa'}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={onCancel}
              className="button bg-amber-600!"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}