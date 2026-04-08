import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProductCategory,
  deleteProductCategory,
  updateProductCategory
} from '@/services/products/categoryApi';
import type { ProductCategoryItemPayload } from '@/services/products/types';

// 商品分类新增：成功后刷新分类列表
export function useCreateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductCategoryItemPayload) => createProductCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'categories'] });
    }
  });
}

// 商品分类编辑：成功后刷新分类列表
export function useUpdateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductCategoryItemPayload }) => updateProductCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'categories'] });
    }
  });
}

// 商品分类删除：成功后刷新分类列表
export function useDeleteProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProductCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'categories'] });
    }
  });
}
