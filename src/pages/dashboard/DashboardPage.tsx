/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 20:51:49
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-03 16:45:39
 * @FilePath: \pd_crm\src\pages\dashboard\DashboardPage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Card, Col, Row, Statistic, Typography } from 'antd';

// 首页概览：展示 CRM 核心指标卡片
export function DashboardPage() {
  return (
    <div>
      <Typography.Title level={4}>Welcome to PD CRM</Typography.Title>

      {/* <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic title="今日新增线索" value={24} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic title="本月成交订单" value={68} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic title="活跃客户数" value={312} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card>
            <Statistic title="商品总数" value={129} />
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
