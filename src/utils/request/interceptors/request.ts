import type { RequestInterceptor, RequestMethod } from '../index';
import { getAuthHeader } from '@/services/auth';

// 默认请求拦截器：统一 method、自动补充 JSON Content-Type
export const defaultRequestInterceptors: RequestInterceptor[] = [
  async (config) => {
    const method = (config.method || 'GET').toUpperCase() as RequestMethod;
    const nextHeaders = { ...(config.headers || {}) };
    // 注入登录态：存在 token 时统一补充 Authorization 请求头
    const authHeader = getAuthHeader();
    if (authHeader && !nextHeaders.Authorization) {
      nextHeaders.Authorization = authHeader;
    }
    const hasBody = method !== 'GET' && method !== 'DELETE';
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
    if (hasBody && !isFormData && !nextHeaders['Content-Type']) {
      nextHeaders['Content-Type'] = 'application/json';
    }
    return {
      ...config,
      method,
      headers: nextHeaders
    };
  }
];
