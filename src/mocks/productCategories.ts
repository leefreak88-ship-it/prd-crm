import type { ProductCategoryItem } from '@/services/products/types';

// 商品分类模拟数据：支持父子层级关系
export const defaultProductCategoryList: ProductCategoryItem[] = [
  { id: 'pc_100', goodsTypeName: 'CRM 产品', idx: 1, deleted: 0, createTime: new Date('2026-03-20'), updateTime: new Date('2026-03-20'), version: 1 },
  { id: 'pc_101', goodsTypeName: '标准产品', idx: 2, deleted: 0, createTime: new Date('2026-03-20'), updateTime: new Date('2026-03-20'), version: 1 },
  { id: 'pc_102', goodsTypeName: '企业产品', idx: 3, deleted: 0, createTime: new Date('2026-03-20'), updateTime: new Date('2026-03-20'), version: 1 },
  { id: 'pc_200', goodsTypeName: '增值服务', idx: 4, deleted: 0, createTime: new Date('2026-03-20'), updateTime: new Date('2026-03-20'), version: 1 },
  { id: 'pc_201', goodsTypeName: '实施服务', idx: 5, deleted: 0, createTime: new Date('2026-03-20'), updateTime: new Date('2026-03-20'), version: 1 }
];
