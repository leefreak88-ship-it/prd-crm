/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-03-31 20:51:40
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-03 11:11:19
 * @FilePath: \pd_crm\src\pages\login\LoginPage.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '@/services/login/api';
import type { loginRequest } from '@/services/login/types';

// 登录页：当前系统仅 admin 角色，输入任意用户名密码即可进入
export function LoginPage() {
  const navigate = useNavigate();

  // 登录动作：调用 mock 登录接口并跳转后台首页
  const onFinish = async (values: loginRequest) => {
    await userLogin(values);
    message.success('登录成功');
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Card className="w-full max-w-sm shadow-md">
        <Typography.Title level={3}>PD CRM 登录</Typography.Title>
        <Typography.Paragraph type="secondary">当前仅支持 admin 角色</Typography.Paragraph>
        <Form layout="vertical" initialValues={{ userName: 'admin', password: 'tybtub-qavhaK-2wudje' }} onFinish={onFinish}>
          <Form.Item label="账号" name="userName" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="admin" />
          </Form.Item>
          <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
