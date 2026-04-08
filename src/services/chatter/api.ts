/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:18:48
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 17:13:54
 * @FilePath: \pd_crm\src\services\bills\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import type { Chatters, ChatterListReq, ChatterReq } from './types';
import type { PaginationResp, MsgResponse } from '../types';
export async function fetchChatterList(params: ChatterListReq) {
  return http.post<PaginationResp<Chatters>>('/background/chatHands/page', params);
}

export async function addChatter(params: ChatterReq) {
  return http.post<MsgResponse>('/background/chatHands/add', params);
}

export async function updateChatter(id: string, params: ChatterReq) {
  return http.put<MsgResponse>('/background/chatHands/update', { id, ...params });
}

export async function deleteChatter(id: string) {
  return http.delete<MsgResponse>(`/background/chatHands/delete/${id}`);
}
