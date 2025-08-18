import { useQuery } from '@tanstack/react-query';
import { getCart } from '@api/cart';
import { createOrder } from '@api/order';
import { useAuthStore } from '@store/auth';
import { Card, Radio, Space, Typography, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout() {
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const navigate = useNavigate();
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ['cart', user?.id],
    queryFn: () => getCart(user!.id)
  });

  if (!user) return <Typography.Text style={{ color: '#fff' }}>请先登录</Typography.Text>;

  const onSubmit = async () => {
    if (!data || !data.items?.length) return message.warning('购物车为空');
    try {
      const order = await createOrder(user.id, {
        items: data.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        paymentMethod
      });
      message.success(`下单成功，订单号 #${order.id}`);
      navigate('/');
    } catch (e: any) {
      message.error(e?.message || '下单失败');
    }
  };

  const total = Number(data?.total ?? 0);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card className="glass-card fade-in">
        <Typography.Title level={4} style={{ marginTop: 0 }}>支付方式</Typography.Title>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Space direction="vertical">
            <Radio value="CARD">银行卡</Radio>
            <Radio value="WECHAT">微信支付</Radio>
            <Radio value="ALIPAY">支付宝</Radio>
          </Space>
        </Radio.Group>
      </Card>
      <Card className="glass-card fade-in">
        <Typography.Title level={4} style={{ marginTop: 0 }}>应付金额</Typography.Title>
        <Typography.Title level={2} style={{ margin: 0 }}>¥ {total.toFixed(2)}</Typography.Title>
      </Card>
      <Button type="primary" size="large" onClick={onSubmit}>确认下单</Button>
    </Space>
  );
}


