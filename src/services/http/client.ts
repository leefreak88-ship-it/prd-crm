import http, { type RequestOptions } from '@/utils/request';

// 兼容导出：保留原 request 入口，底层切换为通用请求客户端
export async function request<T>(config: RequestOptions) {
  return http.request<T>(config);
}

// 兼容导出：保留 http 命名导出供业务使用
export { http };
