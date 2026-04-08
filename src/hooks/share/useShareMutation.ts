import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addShare, deleteShare, updateShare } from '@/services/share/api';
import type { ShareModel } from '@/services/share/types';

export function useCreateShareMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShareModel) => addShare(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share', 'list'] });
    }
  });
}

export function useUpdateShareMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ShareModel) => updateShare(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share', 'list'] });
    }
  });
}

export function useDeleteShareMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShare(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['share', 'list'] });
    }
  });
}
