/*
 * 通用请求客户端：基于 fetch
 * - 集成请求/响应拦截器
 * - 支持取消、防重复、统一错误处理
 * - 便捷方法返回 Promise<T>
 */
import { defaultRequestInterceptors } from './interceptors/request';
import { createDefaultResponseInterceptors } from './interceptors/response';
import { message } from 'antd';

// 通用对象类型：用于 params、data、headers 等场景
export type AnyObject = Record<string, any>;

// 去重策略：重复请求时取消前一个或忽略后一个
export type DedupeStrategy = 'cancel-previous' | 'ignore-next';

// 请求方法类型：覆盖常见 HTTP 方法
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// 请求配置：单次请求支持覆盖全局配置
export interface RequestOptions {
  url: string;
  method?: RequestMethod;
  baseURL?: string;
  params?: AnyObject;
  data?: AnyObject | FormData | Blob | string | null;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob';
  dedupeStrategy?: DedupeStrategy;
  requestKey?: string;
  silentError?: boolean;
}

// 客户端配置：全局默认参数
export interface ClientOptions {
  baseURL?: string;
  timeout?: number;
  enableDedupe?: boolean;
  dedupeStrategy?: DedupeStrategy;
  successCodes?: number[];
  headers?: Record<string, string>;
  getRequestKey?: (options: RequestOptions) => string;
}

// 请求拦截器：入参为请求配置，返回处理后的配置
export type RequestInterceptor = (options: RequestOptions) => Promise<RequestOptions> | RequestOptions;

// 响应拦截器：入参为响应结果与请求配置，返回处理后的结果
export type ResponseInterceptor = (response: unknown, options: RequestOptions) => Promise<unknown> | unknown;

// 请求错误：统一抛出业务错误结构
export class ApiError extends Error {
  statusCode?: number;
  data?: unknown;
  config?: RequestOptions;
  raw?: unknown;

  constructor(
    message: string,
    payload?: {
      statusCode?: number;
      data?: unknown;
      config?: RequestOptions;
      raw?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = payload?.statusCode;
    this.data = payload?.data;
    this.config = payload?.config;
    this.raw = payload?.raw;
  }
}

// 重复请求错误：用于 ignore-next 策略
export class DuplicateRequestError extends Error {
  requestKey: string;

  constructor(requestKey: string) {
    super(`重复请求已拦截: ${requestKey}`);
    this.name = 'DuplicateRequestError';
    this.requestKey = requestKey;
  }
}

// 稳定序列化：用于生成请求唯一键
function stableStringify(obj: any): string {
  if (obj === null || obj === undefined) {
    return '';
  }
  if (typeof obj !== 'object') {
    return String(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map((value) => stableStringify(value)).join(',')}]`;
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map((key) => `${key}:${stableStringify(obj[key])}`);
  return `{${pairs.join(',')}}`;
}

// 默认请求键生成器：method + url + params + data
function defaultGetRequestKey(options: RequestOptions): string {
  return [
    (options.method || 'GET').toUpperCase(),
    options.url,
    stableStringify(options.params),
    stableStringify(options.data)
  ].join('|');
}

// 是否绝对地址：绝对地址不拼接 baseURL
function isAbsoluteURL(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

// 构建完整 URL：拼接 baseURL + path + query
function buildURL(baseURL = '', url = '', params?: AnyObject): string {
  const raw = isAbsoluteURL(url)
    ? url
    : `${baseURL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`.replace(/(?<!:)\/{2,}/g, '/');
  if (!params || Object.keys(params).length === 0) {
    return raw;
  }
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)));
      return;
    }
    query.append(key, String(value));
  });
  const queryString = query.toString();
  if (!queryString) {
    return raw;
  }
  return raw.includes('?') ? `${raw}&${queryString}` : `${raw}?${queryString}`;
}

// 环境基准地址：优先读取 Vite 环境变量
export function getBaseURLByEnv() {
  return import.meta.env.VITE_API_BASE_URL ?? '/api';
}

// 默认响应拦截器：统一处理 HTTP 与业务码
export const defaultResponseInterceptors: ResponseInterceptor[] = createDefaultResponseInterceptors(ApiError);

// 请求客户端：负责配置合并、拦截器链、防重复、取消与便捷方法
export class RequestClient {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private pending = new Map<string, { controller: AbortController; cancel: () => void }>();

  private opts: Required<Omit<ClientOptions, 'headers' | 'getRequestKey'>> & {
    headers?: ClientOptions['headers'];
    getRequestKey: (options: RequestOptions) => string;
  };

  private notifyError(error: ApiError, config: RequestOptions) {
    if (config.silentError) {
      return;
    }
    const text = (error.message || '').trim();
    if (!text || text === '请求已取消或超时') {
      return;
    }
    message.error(text);
  }

  constructor(options?: ClientOptions) {
    this.opts = {
      baseURL: options?.baseURL ?? '',
      timeout: options?.timeout ?? 15000,
      enableDedupe: options?.enableDedupe ?? true,
      dedupeStrategy: options?.dedupeStrategy ?? 'cancel-previous',
      successCodes: options?.successCodes ?? [0, 200],
      headers: options?.headers,
      getRequestKey: options?.getRequestKey ?? defaultGetRequestKey
    };
    defaultRequestInterceptors.forEach((fn) => this.useRequestInterceptor(fn));
    defaultResponseInterceptors.forEach((fn) => this.useResponseInterceptor(fn));
  }

  // 注册请求拦截器：按注册顺序执行
  useRequestInterceptor(fn: RequestInterceptor) {
    this.requestInterceptors.push(fn);
  }

  // 注册响应拦截器：按注册顺序执行
  useResponseInterceptor(fn: ResponseInterceptor) {
    this.responseInterceptors.push(fn);
  }

  // 获取真实请求键：用于外部主动取消指定请求
  async getRequestKeyFor(options: RequestOptions): Promise<string> {
    let config: RequestOptions = {
      ...options,
      baseURL: options.baseURL ?? this.opts.baseURL,
      headers: { ...(this.opts.headers || {}), ...(options.headers || {}) },
      method: (options.method || 'GET').toUpperCase() as RequestMethod
    };
    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }
    return this.opts.getRequestKey(config);
  }

  // 设置全局请求头：用于登录态 token 动态注入
  setHeader(key: string, value: string) {
    const headers = this.opts.headers || {};
    headers[key] = value;
    this.opts.headers = headers;
  }

  // 按请求键取消：仅取消该键对应的请求
  cancelByKey(key: string) {
    const found = this.pending.get(key);
    if (found) {
      found.cancel();
      this.pending.delete(key);
    }
  }

  // 取消全部请求：常用于页面卸载或退出登录
  cancelAll() {
    this.pending.forEach((value) => value.cancel());
    this.pending.clear();
  }

  // 发起请求：返回 Promise<T>，支持拦截器、防重复与取消
  async request<T = any>(input: RequestOptions): Promise<T> {
    let config: RequestOptions = {
      ...input,
      baseURL: input.baseURL ?? this.opts.baseURL,
      timeout: input.timeout ?? this.opts.timeout,
      headers: { ...(this.opts.headers || {}), ...(input.headers || {}) },
      method: (input.method || 'GET').toUpperCase() as RequestMethod,
      dedupeStrategy: input.dedupeStrategy ?? this.opts.dedupeStrategy
    };

    (config as RequestOptions & { _successCodes?: number[] })._successCodes = this.opts.successCodes;

    for (const interceptor of this.requestInterceptors) {
      config = await interceptor(config);
    }

    const requestKey = (config.requestKey = this.opts.getRequestKey(config));
    const dedupeEnabled = this.opts.enableDedupe;

    if (dedupeEnabled && this.pending.has(requestKey)) {
      const strategy = config.dedupeStrategy || 'cancel-previous';
      const current = this.pending.get(requestKey)!;
      if (strategy === 'cancel-previous') {
        current.cancel();
        this.pending.delete(requestKey);
      } else if (strategy === 'ignore-next') {
        return Promise.reject(new DuplicateRequestError(requestKey));
      }
    }

    const finalUrl = buildURL(config.baseURL, config.url, config.params as AnyObject);
    const controller = new AbortController();
    const cancel = () => {
      try {
        controller.abort();
      } catch (_) {}
      this.pending.delete(requestKey);
    };
    this.pending.set(requestKey, { controller, cancel });

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, config.timeout);

    try {
      const body =
        config.method === 'GET' || config.method === 'DELETE'
          ? undefined
          : config.data instanceof FormData || config.data instanceof Blob || typeof config.data === 'string'
            ? config.data
            : config.data !== undefined
              ? JSON.stringify(config.data)
              : undefined;

      const response = await fetch(finalUrl, {
        method: config.method,
        headers: config.headers,
        body,
        signal: controller.signal
      });

      let parsedData: unknown = null;
      const responseType = config.responseType;
      const contentType = response.headers.get('content-type') || '';
      if (responseType === 'blob') {
        parsedData = await response.blob();
      } else if (responseType === 'text') {
        parsedData = await response.text();
      } else if (responseType === 'json' || contentType.includes('application/json')) {
        parsedData = await response.json().catch(() => null);
      } else {
        parsedData = await response.text();
      }

      let output: unknown = {
        statusCode: response.status,
        ok: response.ok,
        data: parsedData,
        headers: Object.fromEntries(response.headers.entries()),
        raw: response
      };

      for (const interceptor of this.responseInterceptors) {
        output = await interceptor(output, config);
      }

      return output as T;
    } catch (error: any) {
      if (error instanceof ApiError) {
        this.notifyError(error, config);
        throw error;
      }
      if (error instanceof DuplicateRequestError) {
        throw error;
      }
      const isAbort = error?.name === 'AbortError';
      const apiError = new ApiError(isAbort ? '请求已取消或超时' : error?.message || '网络异常', {
        config,
        raw: error
      });
      this.notifyError(apiError, config);
      throw apiError;
    } finally {
      clearTimeout(timeoutId);
      this.pending.delete(requestKey);
    }
  }

  // GET 方法：将 params 挂到 URL 查询参数
  get<T = any>(
    url: string,
    params?: AnyObject,
    options?: Omit<RequestOptions, 'url' | 'method' | 'params'>
  ) {
    return this.request<T>({ url, method: 'GET', params, ...(options || {}) });
  }

  // DELETE 方法：将 params 挂到 URL 查询参数
  delete<T = any>(
    url: string,
    params?: AnyObject,
    options?: Omit<RequestOptions, 'url' | 'method' | 'params'>
  ) {
    return this.request<T>({ url, method: 'DELETE', params, ...(options || {}) });
  }

  // POST 方法：将 data 放入请求体
  post<T = any>(
    url: string,
    data?: AnyObject,
    options?: Omit<RequestOptions, 'url' | 'method' | 'data'>
  ) {
    return this.request<T>({ url, method: 'POST', data, ...(options || {}) });
  }

  // PUT 方法：将 data 放入请求体
  put<T = any>(
    url: string,
    data?: AnyObject,
    options?: Omit<RequestOptions, 'url' | 'method' | 'data'>
  ) {
    return this.request<T>({ url, method: 'PUT', data, ...(options || {}) });
  }
}

// 默认实例：直接可用于业务请求
export const http = new RequestClient({
  baseURL: getBaseURLByEnv(),
  timeout: 15000,
  enableDedupe: true,
  dedupeStrategy: 'cancel-previous'
});

export default http;
