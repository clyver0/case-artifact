import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { db } from '../store';
import { TRPCError } from '@trpc/server';

export const taskRouter = createTRPCRouter({
  // Listar com suporte opcional a paginação/infinite scroll (Bônus)
  listar: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().nullish(),
      }).optional()
    )
    .query(({ input }) => {
      const limit = input?.limit ?? 10;
      const cursor = input?.cursor ?? 0;
      const todas = db.getTarefas();

      const slice = todas.slice(cursor, cursor + limit);
      let nextCursor: typeof cursor | undefined = undefined;

      if (cursor + limit < todas.length) {
        nextCursor = cursor + limit;
      }

      return {
        tarefas: slice,
        nextCursor,
        total: todas.length,
      };
    }),

  // Criar Tarefa (Valida se o título não está vazio)
  criar: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(1, "O título da tarefa não pode estar vazio"),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      return db.criarTarefa(input);
    }),

  // Atualizar Tarefa (Valida ID e lança erro 404 se não achar)
  atualizar: publicProcedure
    .input(
      z.object({
        id: z.string(),
        titulo: z.string().min(1, "O título é obrigatório"),
        descricao: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const atualizada = db.atualizarTarefa(input.id, {
        titulo: input.titulo,
        descricao: input.descricao,
      });
      if (!atualizada) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tarefa não encontrada para atualização.',
        });
      }
      return atualizada;
    }),

  // Deletar Tarefa (Valida ID e lança erro 404 se não achar)
  deletar: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const sucesso = db.deletarTarefa(input.id);
      if (!sucesso) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tarefa não encontrada para exclusão.',
        });
      }
      return { success: true };
    }),
});