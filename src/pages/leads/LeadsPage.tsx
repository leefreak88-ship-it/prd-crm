import { Card, Empty, Typography } from 'antd';

// 线索管理页：预留业务内容区域
export function LeadsPage() {
  return (
    <Card>
      <Typography.Title level={4}>线索管理</Typography.Title>
      <Empty description="线索模块待接入业务接口" />
    </Card>
  );
}
