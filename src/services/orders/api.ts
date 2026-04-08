/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:20:08
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 17:58:19
 * @FilePath: \pd_crm\src\services\orders\api.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/request';
import type { PaginationResp } from '../types';
import type { OrderDto, OrderListReq } from './types';
// 订单分页查询：通过接口获取列表
export async function fetchOrderList(params: OrderListReq) {
  return http.post<PaginationResp<OrderDto>>('/background/order/page', params);
}

