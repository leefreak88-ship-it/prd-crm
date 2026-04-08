/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-01 09:59:53
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-01 22:07:34
 * @FilePath: \pd_crm\src\services\login\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import { loginAsAdmin } from '@/services/auth';
import type { loginRequest, LoginResponse } from './types';

export function userLogin(payload: loginRequest) {
  return http.post<LoginResponse>('/background/user/login', payload).then((result) => {
    // 登录成功后：同时持久化 token 与用户信息
    if (result.token) {
      loginAsAdmin(result.token, { userId: result.userId, userName: result.userName });
    }
    return result;
  });
}
