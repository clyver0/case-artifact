import type { Tarefa } from '@/types/task';

interface TaskItemProps {
  tarefa: Tarefa;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TaskItem({ tarefa, onEdit, onDelete, isDeleting }: TaskItemProps) {
  return (
    <div className="group bg-gray-900/80 backdrop-blur-sm p-5 rounded-xl border border-gray-800 shadow-sm hover:border-gray-700 transition-all duration-200 flex items-start justify-between gap-4">
      <div className="space-y-1.5 min-w-0 flex-1">
        <h3 className="font-semibold text-gray-100 tracking-tight wrap-break-word">{tarefa.titulo}</h3>
        {tarefa.descricao && (
          <p className="text-sm text-gray-400 leading-relaxed wrap-break-word">{tarefa.descricao}</p>
        )}
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-800 text-gray-400 border border-gray-700/50">
            Criado em: {new Date(tarefa.dataCriacao).toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <button
          onClick={() => onEdit(tarefa)}
          className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-950/50 border border-blue-900/50 rounded-lg hover:bg-blue-900/50 hover:text-blue-300 transition hover:cursor-pointer"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(tarefa.id)}
          disabled={isDeleting}
          className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-950/50 border border-red-900/50 rounded-lg hover:bg-red-900/50 hover:text-red-300 transition disabled:opacity-50 hover:cursor-pointer"
        >
          {isDeleting ? 'Deletando...' : 'Excluir'}
        </button>
      </div>
    </div>
  );
}