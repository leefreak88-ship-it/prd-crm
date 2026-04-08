import { useMemo, useState } from 'react';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
  ClusterOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ShareAltOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '@/services/auth';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', label: <Link to="/admin/dashboard">首页</Link>, icon: <DashboardOutlined /> },
  { key: '/admin/chatter', label: <Link to="/admin/chatter">聊手管理</Link>, icon: <TeamOutlined /> },
  { key: '/admin/bills', label: <Link to="/admin/bills">账单管理</Link>, icon: <ClusterOutlined /> },
  { key: '/admin/orders', label: <Link to="/admin/orders">订单管理</Link>, icon: <ShoppingCartOutlined /> },
  { key: '/admin/products', label: <Link to="/admin/products">商品管理</Link>, icon: <AppstoreOutlined /> },
  { key: '/admin/share', label: <Link to="/admin/share">分享模板管理</Link>, icon: <ShareAltOutlined /> }
];

// 后台主布局：顶部导航 + 左侧菜单 + 内容区域
export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // 当前登录用户名：优先展示登录返回的用户名称
  const currentUserName = useMemo(() => getCurrentUser()?.userName || '超级管理员', []);

  // 当前菜单高亮：根据路由路径自动定位
  const selectedKeys = useMemo(() => {
    const hit = menuItems.find((item) => location.pathname.startsWith(item.key));
    return [hit?.key ?? '/admin/dashboard'];
  }, [location.pathname]);

  // 用户下拉菜单：仅保留 admin 退出
  const userMenus = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login', { replace: true });
      }
    }
  ];

  return (
    <Layout className="h-screen">
      <Sider collapsed={collapsed} className="!bg-white border-r border-slate-200">
        <div className="h-14 px-4 flex items-center border-b border-slate-200">
          <Typography.Text strong className="cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
            {collapsed ? 'CRM' : 'PD CRM'}
          </Typography.Text>
        </div>
        <Menu mode="inline" selectedKeys={selectedKeys} items={menuItems} className="pt-2" />
      </Sider>
      <Layout>
        <Header className="!bg-white px-4 flex items-center justify-between border-b border-slate-200">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          />
          <Dropdown menu={{ items: userMenus }} trigger={['click']}>
            <Space className="cursor-pointer">
              <Avatar size={30} icon={<UserOutlined />} />
              <Typography.Text>{currentUserName}</Typography.Text>
            </Space>
          </Dropdown>
        </Header>
        <Content className="p-4 bg-slate-50">
          <div className="h-full rounded-md border border-slate-200 bg-white p-4">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
