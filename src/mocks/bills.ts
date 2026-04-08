import type { BillDto } from '@/services/bills/types';

// 账单模拟数据：用于页面快速展示与 CRUD 联调
export const defaultBillList: BillDto[] = [
  {
    id: 'b_001',
    chatHandsId: 'c_001',
    goodsId: 'g_001',
    orderPrice: 1280000,
    shareModelId: 'sm_001',
    chatHandsInfo: {
      id: 'c_001',
      chatHandsName: '王小明',
      chatHandsPhone: '13800138000',
      remark: '核心销售'
    },
    shareModelInfo: {
      id: 'sm_001',
      shareModelName: '年费续费模版',
      shareModelTitle: '企业年费续费',
      shareModelType: 1
    },
    createTime: new Date('2026-03-28 10:00:00'),
    updateTime: new Date('2026-03-28 11:00:00')
  },
  {
    id: 'b_002',
    chatHandsId: 'c_002',
    goodsId: 'g_002',
    orderPrice: 3000000,
    shareModelId: 'sm_002',
    chatHandsInfo: {
      id: 'c_002',
      chatHandsName: '李小红',
      chatHandsPhone: '13900139000',
      remark: '实施跟进'
    },
    shareModelInfo: {
      id: 'sm_002',
      shareModelName: '实施服务模版',
      shareModelTitle: '系统实施套餐',
      shareModelType: 2
    },
    createTime: new Date('2026-03-29 09:30:00'),
    updateTime: new Date('2026-03-29 10:00:00')
  }
];
