import { Card, Typography } from 'antd';

export default function CartSummary({ total }: { total: number }) {
  return (
    <Card className="glass-card">
      <Typography.Title level={4} style={{ marginTop: 0 }}>合计</Typography.Title>
      <Typography.Title level={3} style={{ margin: 0 }}>¥ {total.toFixed(2)}</Typography.Title>
    </Card>
  );
}


