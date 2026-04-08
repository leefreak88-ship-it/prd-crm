import { useQuery } from '@tanstack/react-query';
import { fetchProductList } from '@/services/products/api';

// 商品列表查询：统一管理缓存与加载状态
export function useProductQuery() {
  return useQuery({
    queryKey: ['products', 'list'],
    queryFn: () => fetchProductList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
