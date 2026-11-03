export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string | null;
  dataCriacao: number;
}

export interface TarefaFormulario {
  titulo: string;
  descricao: string;
}

export interface TarefaPagina {
  tarefas: Tarefa[];
  nextCursor: number | null;
}

export interface TarefaCriarInput extends TarefaFormulario {}

export interface TarefaAtualizarInput extends TarefaFormulario {
  id: string;
}

export interface TarefaDeletarInput {
  id: string;
}

export interface TarefaListarInput {
  limit: number;
}