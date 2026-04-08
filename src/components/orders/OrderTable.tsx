import { useMemo } from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useOrderQuery } from '@/hooks/orders/useOrderQuery';
import type { OrderDto } from '@/services/orders/types';

// 订单表格组件：仅提供订单列表查询展示
export function OrderTable() {
  const { data = [], isLoading } = useOrderQuery();

  // 表格列定义：展示订单 DTO 核心信息
  const columns: ColumnsType<OrderDto> = useMemo(
    () => [
      { title: '订单记录ID', dataIndex: 'id', width: 180 },
      { title: '订单编号', dataIndex: 'orderId', width: 180 },
      { title: '聊手ID', dataIndex: ['orderInfo', 'chatHandsId'], width: 120 },
      { title: '商品ID', dataIndex: ['orderInfo', 'goodsId'], width: 120 },
      {
        title: '订单金额(元)',
        dataIndex: ['orderInfo', 'orderPrice'],
        render: (value?: number) => `¥${((value || 0) / 100).toLocaleString('zh-CN')}`
      },
      { title: '分享模版ID', dataIndex: ['orderInfo', 'shareModelId'] }
    ],
    []
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Typography.Title level={4} className="!mb-0">
          订单管理
        </Typography.Title>
      </div>
      <Table rowKey="id" loading={isLoading} columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
    </div>
  );
}
