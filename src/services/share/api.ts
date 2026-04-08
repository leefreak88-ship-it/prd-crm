/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:18:48
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 00:58:06
 * @FilePath: \pd_crm\src\services\bills\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import type { ShareTemplate, ShareListReq, ShareModel } from './types';
import type { PaginationResp, MsgResponse } from '../types';

// 新增账单：模拟后端写入
export async function fetchShareList(params: ShareListReq) {
  return http.post<PaginationResp<ShareTemplate>>('/background/shareModel/page', params);
}

// 新增分享模板：模拟后端写入
export async function addShare(params: ShareModel) {
  return http.post<MsgResponse>('/background/shareModel/add', params);
}

// 更新分享模板：模拟后端写入
export async function updateShare(params: ShareModel) {
  return http.put<MsgResponse>('/background/shareModel/update', params);
}

// 删除分享模板：模拟后端写入
export async function deleteShare(id: string) {
  return http.delete<MsgResponse>(`/background/shareModel/delete/${id}`);
}
