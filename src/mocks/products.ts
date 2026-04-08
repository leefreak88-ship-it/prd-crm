import type { ProductItem } from '@/services/products/types';

// 商品模拟数据：用于快速展示与 CRUD 联调
export const defaultProductList: ProductItem[] = [
  {
    id: 'p_001',
    goodsName: 'CRM 标准版',
    goodsImage: 'https://dummyimage.com/120x120/5b8ff9/ffffff&text=CRM-S',
    goodsTypeId: 'pc_101',
    goodsPrice: 199900,
    idx: 1,
    deleted: 0,
    createTime: new Date('2026-03-25 10:00:00'),
    updateTime: new Date('2026-03-25 10:00:00'),
    version: 1
  },
  {
    id: 'p_002',
    goodsName: 'CRM 企业版',
    goodsImage: 'https://dummyimage.com/120x120/61dDAA/ffffff&text=CRM-E',
    goodsTypeId: 'pc_102',
    goodsPrice: 599900,
    idx: 2,
    deleted: 0,
    createTime: new Date('2026-03-26 11:00:00'),
    updateTime: new Date('2026-03-26 11:00:00'),
    version: 1
  }
];
