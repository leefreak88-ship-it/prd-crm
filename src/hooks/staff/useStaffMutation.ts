import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addChatter, deleteChatter, updateChatter } from '@/services/chatter/api';
import type { ChatterReq } from '@/services/chatter/types';

// 聊手新增：统一在成功后刷新聊手列表
export function useCreateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChatterReq) => addChatter(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatter', 'list'] });
    }
  });
}

// 聊手编辑：统一在成功后刷新聊手列表
export function useUpdateStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ChatterReq }) => updateChatter(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatter', 'list'] });
    }
  });
}

// 聊手删除：统一在成功后刷新聊手列表
export function useDeleteStaffMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChatter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatter', 'list'] });
    }
  });
}
