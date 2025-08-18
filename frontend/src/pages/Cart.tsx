import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, removeItem } from '@api/cart';
import { useAuthStore } from '@store/auth';
import { Button, Card, List, Space, Typography, message, Empty } from 'antd';
import CartSummary from '@components/CartSummary';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data } = useQuery({
    enabled: !!user,
    queryKey: ['cart', user?.id],
    queryFn: () => getCart(user!.id)
  });

  const removeMutation = useMutation({
    mutationFn: (menuItemId: number) => removeItem(user!.id, menuItemId),
    onSuccess: () => {
      message.success('已移除');
      qc.invalidateQueries({ queryKey: ['cart', user?.id] });
    }
  });

  if (!user)
    return (
      <Card className="glass-card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <Typography.Paragraph>请先登录以查看购物车。</Typography.Paragraph>
        <Link to="/login">
          <Button type="primary">去登录</Button>
        </Link>
      </Card>
    );

  const items = data?.items ?? [];
  const total = Number(data?.total ?? 0);

  if (!items.length) return <Empty description="购物车为空" />;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Card className="glass-card fade-in">
        <List
          dataSource={items}
          renderItem={(it) => (
            <List.Item
              actions={[
                <Button danger onClick={() => removeMutation.mutate(it.menuItemId)} key="rm">
                  移除
                </Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Typography.Text>{it.name}</Typography.Text>
                    <Typography.Text type="secondary">x{it.quantity}</Typography.Text>
                  </Space>
                }
                description={`¥ ${Number(it.price).toFixed(2)}`}
              />
              <Typography.Text strong>
                ¥ {(Number(it.price) * it.quantity).toFixed(2)}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Card>
      <CartSummary total={total} />
      <Space>
        <Button type="primary" onClick={() => navigate('/checkout')}>去结算</Button>
        <Link to="/">
          <Button>继续选购</Button>
        </Link>
      </Space>
    </Space>
  );
}


