import { Card, Descriptions, Typography, Form, Input, Button, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { getProfile, changePassword } from '@api/auth';
import { useAuthStore } from '@store/auth';

export default function Profile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      if (!user?.email) return;
      try {
        const p = await getProfile(user.email);
        setProfile(p);
      } catch (e: any) {
        message.error(e?.message || '加载失败');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user?.email]);

  const onChangePassword = async (values: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    if (!user?.email) return;
    try {
      await changePassword({ email: user.email, ...values });
      message.success('密码修改成功');
    } catch (e: any) {
      message.error(e?.message || '修改失败');
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card className="glass-card" loading={loading} title={<Typography.Title level={4} style={{ margin: 0 }}>个人资料</Typography.Title>}>
        {profile && (
          <Descriptions column={1} size="middle">
            <Descriptions.Item label="昵称">{profile.name}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{profile.email}</Descriptions.Item>
            <Descriptions.Item label="类型">{profile.userType}</Descriptions.Item>
            <Descriptions.Item label="创建时间">{profile.createdAt}</Descriptions.Item>
            <Descriptions.Item label="最近登录">{profile.lastLogin}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      <Card className="glass-card" title={<Typography.Title level={4} style={{ margin: 0 }}>修改密码</Typography.Title>}>
        <Form layout="vertical" onFinish={onChangePassword} style={{ maxWidth: 520 }}>
          <Form.Item name="currentPassword" label="当前密码" rules={[{ required: true, message: '请输入当前密码' }]}>
            <Input.Password placeholder="当前密码" />
          </Form.Item>
          <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入新密码' }]}>
            <Input.Password placeholder="新密码" />
          </Form.Item>
          <Form.Item name="confirmNewPassword" label="确认新密码" dependencies={["newPassword"]} rules={[{ required: true, message: '请再次输入新密码' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('newPassword') === value) return Promise.resolve(); return Promise.reject(new Error('两次输入不一致')); } })]}>
            <Input.Password placeholder="确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
}


