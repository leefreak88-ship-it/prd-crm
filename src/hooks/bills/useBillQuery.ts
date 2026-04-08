import { useQuery } from '@tanstack/react-query';
import { fetchBillList } from '@/services/bills/api';

// 账单列表查询：统一管理缓存与加载状态
export function useBillQuery() {
  return useQuery({
    queryKey: ['bills', 'list'],
    queryFn: () => fetchBillList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
