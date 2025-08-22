import { useQuery } from '@tanstack/react-query';
import { getCart } from '@api/cart';
import { createOrder } from '@api/order';
import { useAuthStore } from '@store/auth';
import { Card, Radio, Space, Typography, Button, message, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout() {
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const navigate = useNavigate();
  const [cardForm] = Form.useForm();
  const { data } = useQuery({
    enabled: !!user,
    queryKey: ['cart', user?.id],
    queryFn: () => getCart(user!.id)
  });

  if (!user) return <Typography.Text style={{ color: '#fff' }}>请先登录</Typography.Text>;

  const onSubmit = async () => {
    if (!data || !data.items?.length) return message.warning('购物车为空');
    if (paymentMethod === 'CARD') {
      try {
        await cardForm.validateFields();
      } catch {
        message.warning('请正确填写银行卡信息');
        return;
      }
    }
    try {
      const order = await createOrder(user.id, {
        items: data.items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
        paymentMethod
      });
      message.success(`下单成功，订单号 #${order.id}`);
      navigate(`/orders/${order.id}`);
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
        {paymentMethod === 'CARD' && (
          <div style={{ marginTop: 16 }}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>Card Details</Typography.Title>
            <Form form={cardForm} layout="vertical" autoComplete="off">
              <Form.Item name="cardholder" label="Cardholder Name" rules={[{ required: true, message: '请输入持卡人姓名' }]}>
                <Input placeholder="JOHN M DOE" />
              </Form.Item>
              <Form.Item name="cardNumber" label="Card Number" rules={[
                { required: true, message: '请输入卡号' },
                { pattern: /^\d{16}$/, message: '请输入16位数字卡号' }
              ]}>
                <Input placeholder="4242424242424242" maxLength={16} inputMode="numeric" />
              </Form.Item>
              <Space.Compact block>
                <Form.Item name="expiry" label="Expiry (MM/YY)" style={{ width: '50%' }} rules={[
                  { required: true, message: '请输入有效期' },
                  { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: '格式应为 MM/YY' }
                ]}>
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
                <Form.Item name="cvv" label="CVV" style={{ width: '50%', marginLeft: 8 }} rules={[
                  { required: true, message: '请输入CVV' },
                  { pattern: /^\d{3,4}$/, message: 'CVV为3-4位数字' }
                ]}>
                  <Input placeholder="123" maxLength={4} inputMode="numeric" />
                </Form.Item>
              </Space.Compact>
              <Form.Item name="zip" label="ZIP Code" rules={[
                { required: true, message: '请输入邮编' },
                { pattern: /^\d{5}(-\d{4})?$/, message: '请输入有效的美国邮编' }
              ]}>
                <Input placeholder="10001 或 10001-0001" maxLength={10} inputMode="numeric" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Card>
      <Card className="glass-card fade-in">
        <Typography.Title level={4} style={{ marginTop: 0 }}>应付金额</Typography.Title>
        <Typography.Title level={2} style={{ margin: 0 }}>¥ {total.toFixed(2)}</Typography.Title>
      </Card>
      <Button type="primary" size="large" onClick={onSubmit}>确认下单</Button>
    </Space>
  );
}


