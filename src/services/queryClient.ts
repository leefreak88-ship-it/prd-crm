import { QueryClient } from '@tanstack/react-query';

// 全局查询客户端：统一配置缓存时间与重试策略
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30 * 1000
    },
    mutations: {
      retry: 0
    }
  }
});
