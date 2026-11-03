# Gerenciador de Tarefas - Desafio Técnico Next.js 15 e tRPC

Aplicação web moderna desenvolvida para o gerenciamento eficiente de tarefas, implementando padrões avançados de arquitetura frontend, segurança de tipos estrita ponta a ponta e interface responsiva no tema escuro.

---

## 1. Stack Tecnológica

- **Framework**: Next.js 15 (App Router)
- **API Layer**: tRPC v11
- **Validação de Dados**: Zod
- **Gerenciamento de Estado**: React Query / TanStack Query (integrado ao tRPC)
- **Estilização**: Tailwind CSS
- **Linguagem**: TypeScript (Strict Mode)

---

## 2. Decisões de Arquitetura

O projeto foi refatorado aplicando o princípio de separação de responsabilidades e boas práticas de mercado:

- **Contratos Centralizados (`src/types/`)**: Isolamento completo das tipagens das entidades e dos inputs de mutação (`Tarefa`, `TarefaCriarInput`, `TarefaAtualizarInput`, etc.) em arquivo dedicado.
- **Componentização Modular (`src/components/`)**:
  - `TaskForm.tsx`: Componente focado na renderização do formulário de criação e edição.
  - `TaskItem.tsx`: Card de exibição da tarefa com estados de exclusão e edição.
- **Custom Hooks (`src/hooks/`)**:
  - `useTasksController.ts`: Centraliza a regra de negócio, integração com as mutações tRPC, tratamento de formulário e estados de erro, mantendo o arquivo `page.tsx` estritamente focado no layout visual.
  - `useInfiniteScroll.ts`: Abstração para detecção e acionamento automático da paginação por meio da API nativa `IntersectionObserver`.
- **Tipagem Estrita de Eventos**: Utilização de `SubmitEventHandler<HTMLFormElement>` para tratamento correto de formulários segundo as especificações do React 19.

---

## 3. Como Executar o Projeto

Instruções para instalação e execução do projeto em ambiente local:

### Pré-requisitos
- Node.js versão 18.x ou superior
- Gerenciador de pacotes npm

### Passos para execução

1. Instalar as dependências do projeto:
```bash
npm install
```

2. Executar o servidor de desenvolvimento:
```bash
npm run dev
```
A aplicação estará acessível no endereço `http://localhost:3000`.

3. Gerar e testar a compilação de produção:
```bash
npm run build
npm run start
```