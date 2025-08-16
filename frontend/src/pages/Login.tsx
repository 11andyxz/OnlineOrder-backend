import { Button, Card, Form, Input, Typography, message } from 'antd';
import { login } from '@api/auth';
import { useAuthStore } from '@store/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      const user = await login(values);
      setUser(user);
      message.success('登录成功');
      navigate('/');
    } catch (err: any) {
      message.error(err.message || '登录失败');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <Card className="glass-card" style={{ width: 400 }} title={<Typography.Title level={3} style={{ margin: 0 }}>登录</Typography.Title>}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}> 
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <Typography.Text type="secondary">
            还没有账号？<Link to="/register">去注册</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
}


