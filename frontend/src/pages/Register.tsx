import { Button, Card, Form, Input, Typography, message } from 'antd';
import { register } from '@api/auth';
import { useAuthStore } from '@store/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    try {
      const user = await register(values);
      setUser(user);
      message.success('注册成功');
      navigate('/');
    } catch (err: any) {
      message.error(err.message || '注册失败');
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
      <Card className="glass-card" style={{ width: 420 }} title={<Typography.Title level={3} style={{ margin: 0 }}>注册</Typography.Title>}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}> 
            <Input placeholder="张三" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, message: '请输入邮箱' }]}> 
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
          <Typography.Text type="secondary">
            已有账号？<Link to="/login">去登录</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
}


