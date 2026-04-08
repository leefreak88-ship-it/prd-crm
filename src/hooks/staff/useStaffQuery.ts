import { useQuery } from '@tanstack/react-query';
import { fetchChatterList } from '@/services/chatter/api';

// 聊手列表查询：统一管理缓存和加载状态
export function useStaffQuery() {
  return useQuery({
    queryKey: ['chatter', 'list'],
    queryFn: () => fetchChatterList({ pagination: { current: 1, pageSize: 100 } }),
    select: (resp) => resp.result || []
  });
}
