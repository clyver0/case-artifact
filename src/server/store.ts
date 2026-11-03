export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
}

// Lista inicial em memória (mock)
let tarefas: Tarefa[] = [
  { 
    id: "1", 
    titulo: "Configurar o ambiente Next.js 15", 
    descricao: "Instalar dependências e ajustar o Tailwind", 
    dataCriacao: Date.now() - 3600000 
  },
  { 
    id: "2", 
    titulo: "Implementar rotas tRPC", 
    descricao: "Criar os endpoints CRUD de tarefas", 
    dataCriacao: Date.now() - 1800000 
  },
];

export const db = {
  getTarefas: () => [...tarefas].sort((a, b) => b.dataCriacao - a.dataCriacao),

  criarTarefa: (data: { titulo: string; descricao?: string }) => {
    const nova: Tarefa = {
      id: Math.random().toString(36).substring(2, 9),
      titulo: data.titulo,
      descricao: data.descricao,
      dataCriacao: Date.now(),
    };
    tarefas.unshift(nova);
    return nova;
  },

  atualizarTarefa: (id: string, data: { titulo: string; descricao?: string }) => {
    const index = tarefas.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tarefas[index] = {
      ...tarefas[index],
      titulo: data.titulo,
      descricao: data.descricao,
    };
    return tarefas[index];
  },

  deletarTarefa: (id: string) => {
    const index = tarefas.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tarefas.splice(index, 1);
    return true;
  },
};