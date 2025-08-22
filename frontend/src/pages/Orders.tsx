import { useQuery } from '@tanstack/react-query';
import { listOrders } from '@api/order';
import { useAuthStore } from '@store/auth';
import { Card, List, Typography, Space, Button, Empty, Skeleton } from 'antd';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    enabled: !!user,
    queryKey: ['orders', user?.id],
    queryFn: () => listOrders(user!.id)
  });

  if (!user) return <Typography.Text style={{ color: '#fff' }}>请先登录</Typography.Text>;

  if (isLoading) return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card className="glass-card"><Skeleton active /></Card>
      <Card className="glass-card"><Skeleton active /></Card>
    </Space>
  );

  const orders = data ?? [];
  if (!orders.length) return <Empty description="暂无订单" />;

  return (
    <Card className="glass-card" title={<Typography.Title level={4} style={{ margin: 0 }}>我的订单</Typography.Title>}>
      <List
        dataSource={orders}
        renderItem={(o) => (
          <List.Item actions={[<Link key="view" to={`/orders/${o.id}`}><Button type="link">查看</Button></Link>]}> 
            <List.Item.Meta
              title={<Space><Typography.Text>订单 #{o.id}</Typography.Text><Typography.Text type="secondary">{o.status}</Typography.Text></Space>}
              description={<Typography.Text>金额 ¥ {Number(o.amount).toFixed(2)}，共 {o.items?.reduce((s, it) => s + it.quantity, 0)} 件</Typography.Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
}


