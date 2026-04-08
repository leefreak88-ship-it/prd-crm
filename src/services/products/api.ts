/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:21:31
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-03 15:35:33
 * @FilePath: \pd_crm\src\services\products\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import type {
  ProductItem,
  ProductListReq,
  ProductPayload
} from './types';
import type { PaginationResp, MsgResponse } from '../types';
// 获取商品列表：通过接口获取列表
export async function fetchProductList(params: ProductListReq) {
  return http.post<PaginationResp<ProductItem>>('/background/goodsInfo/page', params);
}

// 新增商品：通过接口提交
export async function createProduct(payload: ProductPayload) {
  return http.post<MsgResponse>('/background/goodsInfo/add', payload);
}

// 编辑商品：通过接口更新
export async function updateProduct(id: string, payload: ProductPayload) {
  return http.put<MsgResponse>('/background/goodsInfo/update', { id, ...payload });
}

// 删除商品：通过接口删除
export async function deleteProduct(id: string) {
  return http.delete<MsgResponse>(`/background/goodsInfo/delete/${id}`);
}
