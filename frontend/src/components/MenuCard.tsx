import { Card, Button, Typography, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

interface Props {
  name: string;
  description: string;
  price: number;
  onAdd: () => void;
}

export default function MenuCard({ name, description, price, onAdd }: Props) {
  return (
    <Card className="glass-card" hoverable>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={4} style={{ margin: 0 }}>{name}</Typography.Title>
        <Typography.Paragraph type="secondary" style={{ minHeight: 40 }}>{description}</Typography.Paragraph>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>¥ {price.toFixed(2)}</Typography.Title>
          <Button icon={<ShoppingCartOutlined />} type="primary" onClick={onAdd}>加入购物车</Button>
        </Space>
      </Space>
    </Card>
  );
}


