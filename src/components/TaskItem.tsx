import type { Tarefa } from '@/types/task';

interface TaskItemProps {
  tarefa: Tarefa;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TaskItem({ tarefa, onEdit, onDelete, isDeleting }: TaskItemProps) {
  return (
    <div className="bg-amber-300 p-5 rounded-xl shadow-sm flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h3 className="font-semibold text-slate-900">{tarefa.titulo}</h3>
        {tarefa.descricao && <p className="text-sm text-slate-700">{tarefa.descricao}</p>}
        <span className="text-xs text-slate-600 inline-block pt-1">
          Criado em: {new Date(tarefa.dataCriacao).toLocaleString('pt-BR')}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onEdit(tarefa)}
          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(tarefa.id)}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition disabled:opacity-50"
        >
          {isDeleting ? 'Deletando...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
}