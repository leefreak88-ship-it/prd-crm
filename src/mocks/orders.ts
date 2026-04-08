/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:19:57
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 17:27:21
 * @FilePath: \pd_crm\src\mocks\orders.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { OrderDto } from '@/services/orders/types';

// 订单模拟数据：用于快速展示与 CRUD 联调
export const defaultOrderList: OrderDto[] = [
  {
    id: 'o_001',
    orderId: 'SO20260301001',
    orderInfo: {
      id: 'oi_001',
      chatHandsId: 'c_001',
      goodsId: 'g_001',
      orderPrice: 880000,
      shareModelId: 'sm_001',
      createTime: new Date('2026-03-30 08:00:00'),
      updateTime: new Date('2026-03-30 08:40:00')
    },
    createTime: new Date('2026-03-30 08:00:00'),
    updateTime: new Date('2026-03-30 08:40:00')
  },
  {
    id: 'o_002',
    orderId: 'SO20260301002',
    orderInfo: {
      id: 'oi_002',
      chatHandsId: 'c_002',
      goodsId: 'g_002',
      orderPrice: 1680000,
      shareModelId: 'sm_002',
      createTime: new Date('2026-03-31 11:00:00'),
      updateTime: new Date('2026-03-31 11:20:00')
    },
    createTime: new Date('2026-03-31 11:00:00'),
    updateTime: new Date('2026-03-31 11:20:00')
  }
];
