import { useQuery } from '@tanstack/react-query';
import { getOrder } from '@api/order';
import { Card, Descriptions, List, Typography } from 'antd';
import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const { data, isLoading } = useQuery({ queryKey: ['order', orderId], queryFn: () => getOrder(orderId), enabled: !!orderId });

  return (
    <Card className="glass-card" loading={isLoading} title={<Typography.Title level={4} style={{ margin: 0 }}>订单详情 #{orderId}</Typography.Title>}>
      {data && (
        <>
          <Descriptions column={2} size="middle">
            <Descriptions.Item label="订单号">{data.id}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{data.userId}</Descriptions.Item>
            <Descriptions.Item label="状态">{data.status}</Descriptions.Item>
            <Descriptions.Item label="金额">¥ {Number(data.amount).toFixed(2)}</Descriptions.Item>
          </Descriptions>
          <Typography.Title level={5}>商品项</Typography.Title>
          <List
            dataSource={data.items}
            renderItem={(it) => (
              <List.Item>
                <Typography.Text>菜品ID: {it.menuItemId} × {it.quantity}</Typography.Text>
              </List.Item>
            )}
          />
        </>
      )}
    </Card>
  );
}


