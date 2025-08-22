import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMenu, createMenuItem, updateMenuItem } from '@api/menu';
import type { MenuItemView, UpsertMenuItemRequest } from '@api/types';
import { Button, Card, Form, Input, InputNumber, Switch, Table, Space, Modal, message, Typography } from 'antd';
import { useState } from 'react';
import { useAuthStore } from '@store/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['menu'], queryFn: listMenu });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItemView | null>(null);

  if (!user || user.userType !== 'SUPER_ADMIN') {
    navigate('/');
    return null;
  }

  const columns = [
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    { title: '价格', dataIndex: 'price', render: (v: number) => `¥ ${Number(v).toFixed(2)}` },
    { title: '上架', dataIndex: 'available', render: (v: boolean) => (v ? '是' : '否') },
    {
      title: '操作',
      render: (_: any, record: MenuItemView) => (
        <Space>
          <Button onClick={() => { setEditing(record); setOpen(true); }}>编辑</Button>
        </Space>
      )
    }
  ];

  const upsert = useMutation({
    mutationFn: async (payload: { id?: number; data: UpsertMenuItemRequest }) => {
      if (payload.id) return updateMenuItem(payload.id, payload.data);
      return createMenuItem(payload.data);
    },
    onSuccess: () => {
      message.success('保存成功');
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['menu'] });
    }
  });

  const onAdd = () => { setEditing(null); setOpen(true); };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card className="glass-card" title={<Typography.Title level={4} style={{ margin: 0 }}>菜单管理</Typography.Title>} extra={<Button type="primary" onClick={onAdd}>新增菜品</Button>}>
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={(data ?? []) as MenuItemView[]}
          columns={columns as any}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        open={open}
        title={editing ? '编辑菜品' : '新增菜品'}
        onCancel={() => { setOpen(false); setEditing(null); }}
        onOk={() => { const btn = document.getElementById('admin-submit'); if (btn) btn.click(); }}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={editing ? { ...editing } : { name: '', description: '', price: 0, available: true }}
          onFinish={(values) => upsert.mutate({ id: editing?.id, data: { name: values.name, description: values.description, price: Number(values.price), available: !!values.available } })}
        >
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="菜品名称" />
          </Form.Item>
          <Form.Item name="description" label="描述" rules={[{ required: true, message: '请输入描述' }]}>
            <Input.TextArea placeholder="简要描述" rows={3} />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item name="available" label="上架" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button id="admin-submit" htmlType="submit" type="primary" style={{ display: 'none' }}>提交</Button>
        </Form>
      </Modal>
    </Space>
  );
}


