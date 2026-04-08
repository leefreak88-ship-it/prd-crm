/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-01 09:51:15
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 20:55:14
 * @FilePath: \pd_crm\src\utils\request\interceptors\response.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { AnyObject, RequestOptions, ResponseInterceptor } from '../index';

interface ApiErrorLikeConstructor {
  new (
    message: string,
    payload?: {
      statusCode?: number;
      data?: unknown;
      config?: RequestOptions;
      raw?: unknown;
    }
  ): Error;
}

// 默认响应拦截器工厂：统一处理 HTTP 错误和业务码
export function createDefaultResponseInterceptors(ApiErrorCtor: ApiErrorLikeConstructor): ResponseInterceptor[] {
  return [
    async (raw, config) => {
      const response = raw as {
        statusCode: number;
        ok: boolean;
        data: any;
        headers: Record<string, string>;
        raw: Response;
      };
      if (!response.ok) {
        const payload = response.data as AnyObject;
        const errorMessage =
          (payload && typeof payload === 'object' ? payload.msg || payload.message : '') || `HTTP ${response.statusCode}`;
        throw new ApiErrorCtor(errorMessage, {
          statusCode: response.statusCode,
          data: response.data,
          config,
          raw: response.raw
        });
      }
      const payload = response.data;
      const successCodes = ((config as RequestOptions & { _successCodes?: number[] })._successCodes || [0, 200]).map(Number);
      if (payload && typeof payload === 'object' && 'code' in payload) {
        const code = Number((payload as AnyObject).code);
        const ok = (payload as AnyObject).ok;
        const errorMessage = (payload as AnyObject).msg || (payload as AnyObject).message || '请求失败';
        if (!successCodes.includes(code) || ok === false) {
          throw new ApiErrorCtor(errorMessage, {
            statusCode: response.statusCode,
            data: payload,
            config,
            raw: response.raw
          });
        }
        return (payload as AnyObject).data;
      }
      if (payload && typeof payload === 'object' && 'ok' in (payload as AnyObject) && (payload as AnyObject).ok === false) {
        throw new ApiErrorCtor((payload as AnyObject).msg || (payload as AnyObject).message || '请求失败', {
          statusCode: response.statusCode,
          data: payload,
          config,
          raw: response.raw
        });
      }
      return payload;
    }
  ];
}
