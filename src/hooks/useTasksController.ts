// src/hooks/useTasksController.ts
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import type {
  Tarefa,
  TarefaCriarInput,
  TarefaAtualizarInput,
  TarefaListarInput,
} from "@/types/task";

export function useTasksController() {
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erroForm, setErroForm] = useState<string>("");

  const utils = trpc.useUtils();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.task.listar.useInfiniteQuery(
    { limit: 5 } satisfies TarefaListarInput,
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setEditandoId(null);
    setErroForm("");
  };

  const criarMutation = trpc.task.criar.useMutation({
    onSuccess: () => {
      resetForm();
      utils.task.listar.invalidate();
    },
    onError: (err: { message: string }) => setErroForm(err.message),
  });

  const atualizarMutation = trpc.task.atualizar.useMutation({
    onSuccess: () => {
      resetForm();
      utils.task.listar.invalidate();
    },
    onError: (err: { message: string }) => setErroForm(err.message),
  });

  const deletarMutation = trpc.task.deletar.useMutation({
    onSuccess: () => utils.task.listar.invalidate(),
  });

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setErroForm("O título é obrigatório.");
      return;
    }
    setErroForm("");

    if (editandoId) {
      atualizarMutation.mutate({
        id: editandoId,
        titulo,
        descricao,
      } satisfies TarefaAtualizarInput);
    } else {
      criarMutation.mutate({ titulo, descricao } satisfies TarefaCriarInput);
    }
  };

  const handleEditar = (tarefa: Tarefa): void => {
    setEditandoId(tarefa.id);
    setTitulo(tarefa.titulo);
    setDescricao(tarefa.descricao ?? "");
  };

  const tarefasLista: Tarefa[] =
    data?.pages.flatMap((page) => page.tarefas) ?? [];

  return {
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
    isPending: criarMutation.isPending || atualizarMutation.isPending,
    isDeleting: deletarMutation.isPending,
    handleSubmit,
    handleEditar,
    resetForm,
    deletarTarefa: (id: string) => deletarMutation.mutate({ id }),
  };
}