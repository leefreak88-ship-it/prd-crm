/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:26:20
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 00:47:02
 * @FilePath: \pd_crm\src\services\products\categoryApi.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import type {
  ProductCategoryItemPayload,
  ProductCategoryListReq,
  ProductCategoryItem
} from './types';
import type { PaginationResp, MsgResponse } from '../types';
// 获取分类列表：通过接口获取列表
export async function fetchProductCategoryList(params: ProductCategoryListReq) {
  return http.post<PaginationResp<ProductCategoryItem>>('/background/goodsType/page', params);
}

// 新增分类：通过接口提交
export async function createProductCategory(params: ProductCategoryItemPayload) {
  return http.post<MsgResponse>('/background/goodsType/add', params);
}

// 编辑分类：通过接口更新
export async function updateProductCategory(id: string, params: ProductCategoryItemPayload) {
  return http.put<MsgResponse>('/background/goodsType/update', { id, ...params });
}

// 删除分类：通过接口删除
export async function deleteProductCategory(id: string) {
  return http.delete<MsgResponse>(`/background/goodsType/delete/${id}`);
}
