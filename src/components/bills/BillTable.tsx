/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 21:19:34
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 18:01:40
 * @FilePath: \pd_crm\src\components\bills\BillTable.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useMemo } from 'react';
import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useBillQuery } from '@/hooks/bills/useBillQuery';
import type { BillDto } from '@/services/bills/types';

// 账单表格组件：仅提供账单列表查询展示
export function BillTable() {
  const { data = [], isLoading } = useBillQuery();

  // 表格列定义：展示账单 DTO 核心信息
  const columns: ColumnsType<BillDto> = useMemo(
    () => [
      { title: '账单ID', dataIndex: 'id', width: 180 },
      {
        title: '聊手',
        dataIndex: ['chatHandsInfo', 'chatHandsName'],
        width: 160,
        render: (_, record) => record.chatHandsInfo?.chatHandsName || record.chatHandsId || '-'
      },
      { title: '商品ID', dataIndex: 'goodsId', width: 160 },
      {
        title: '订单金额(元)',
        dataIndex: 'orderPrice',
        render: (value?: number) => `¥${((value || 0) / 100).toLocaleString('zh-CN')}`
      },
      {
        title: '分享模版',
        dataIndex: ['shareModelInfo', 'shareModelName'],
        render: (_, record) => record.shareModelInfo?.shareModelName || record.shareModelId || '-'
      }
    ],
    []
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Typography.Title level={4} className="!mb-0">
          账单管理
        </Typography.Title>
      </div>
      <Table rowKey="id" loading={isLoading} columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
    </div>
  );
}
