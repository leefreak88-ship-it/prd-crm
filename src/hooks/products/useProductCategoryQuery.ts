import { useQuery } from '@tanstack/react-query';
import { fetchProductCategoryList } from '@/services/products/categoryApi';

// 商品分类查询：统一管理分类缓存与加载状态
export function useProductCategoryQuery() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: () => fetchProductCategoryList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
