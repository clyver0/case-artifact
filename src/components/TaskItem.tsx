import type { Tarefa } from "@/types/task";

interface TaskItemProps {
  tarefa: Tarefa;
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function TaskItem({
  tarefa,
  onEdit,
  onDelete,
  isDeleting,
}: TaskItemProps) {
  return (
    <div className="cont">
      <div className="space-y-1.5 min-w-0 flex-1">
        <h3 className="font-bold text-xl text-yellow-300 text-gray-100  wrap-break-word">
          {tarefa.titulo}
        </h3>
        {tarefa.descricao && (
          <p className="   wrap-break-word">
            {tarefa.descricao}
          </p>
        )}

        <span className="text-sm opacity-80">
          Criado em: {new Date(tarefa.dataCriacao).toLocaleString("pt-BR")}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <button
          onClick={() => onEdit(tarefa)}
          className="button bg-amber-600!"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(tarefa.id)}
          disabled={isDeleting}
          className="button bg-red-700!"
        >
          {isDeleting ? "Deletando..." : "Excluir"}
        </button>
      </div>
    </div>
  );
}
