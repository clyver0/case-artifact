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
    <section className="cont flex-col">
      <div className="flex items-center justify-between  w-full">
        <h2 className="font-bold text-gray-100 flex items-center gap-2 text-2xl">
          {editandoId ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
      </div>

      {erroForm && (
        <div className="bg-red-950/80 text-red-300  p-3.5 rounded-xl border border-red-900/50 flex items-center gap-2 w-full">
          <span>Erro: </span> {erroForm}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4 w-full">
        <div>
          <label
            htmlFor="titulo"
            className="block  font-bold   text-gray-400 mb-1.5"
          >
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Refatorar rotas do tRPC"
            className="input "
          />
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block  font-bold   text-gray-400 mb-1.5"
          >
            Descrição (opcional)
          </label>
          <textarea
            id="descricao"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Adicione detalhes sobre a tarefa..."
            className="input"
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
              Voltar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}