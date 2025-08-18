import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listMenu } from '@api/menu';
import { addItem } from '@api/cart';
import { useAuthStore } from '@store/auth';
import { Row, Col, message, Empty, Skeleton } from 'antd';
import MenuCard from '@components/MenuCard';
import type { MenuItemView } from '@api/types';
import { useNavigate } from 'react-router-dom';

export default function MenuPage() {
  const { data, isLoading } = useQuery({ queryKey: ['menu'], queryFn: listMenu });
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const addMutation = useMutation({
    mutationFn: ({ menuItemId }: { menuItemId: number }) => {
      if (!user) throw new Error('请先登录');
      return addItem(user.id, { menuItemId, quantity: 1 });
    },
    onSuccess: () => {
      message.success('已加入购物车');
      qc.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: any) => {
      if (String(err?.message).includes('登录')) navigate('/login');
      else message.error(err?.message || '操作失败');
    }
  });

  if (isLoading) return (
    <Row gutter={[16, 16]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <div className="glass-card" style={{ padding: 16 }}>
            <Skeleton active paragraph={{ rows: 2 }} title style={{ margin: 0 }} />
          </div>
        </Col>
      ))}
    </Row>
  );

  const items = (data ?? []) as MenuItemView[];
  if (!items.length) return <Empty description="暂无菜品" />;

  return (
    <Row gutter={[16, 16]}>
      {items.map((m) => (
        <Col key={m.id} xs={24} sm={12} md={8} lg={6}>
          <MenuCard
            name={m.name}
            description={m.description}
            price={Number(m.price)}
            onAdd={() => addMutation.mutate({ menuItemId: m.id })}
          />
        </Col>
      ))}
    </Row>
  );
}


