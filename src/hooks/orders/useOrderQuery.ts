import { useQuery } from '@tanstack/react-query';
import { fetchOrderList } from '@/services/orders/api';

// 订单列表查询：统一管理缓存与加载状态
export function useOrderQuery() {
  return useQuery({
    queryKey: ['orders', 'list'],
    queryFn: () => fetchOrderList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
