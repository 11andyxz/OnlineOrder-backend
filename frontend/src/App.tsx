import { Layout, Menu as AntMenu, Button, Typography, Space, message } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from '@pages/Login';
import Register from '@pages/Register';
import MenuPage from '@pages/Menu';
import CartPage from '@pages/Cart';
import Checkout from '@pages/Checkout';
import OrderDetail from '@pages/OrderDetail';
import Profile from '@pages/Profile';
import AdminPage from '@pages/Admin';
import OrdersPage from '@pages/Orders';
import { useAuthStore } from '@store/auth';

const { Header, Content, Footer } = Layout;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    message.success('已退出');
    navigate('/');
  };

  const items = [
    { key: '/', label: <Link to="/">菜单</Link>, icon: <AppstoreOutlined /> },
    { key: '/cart', label: <Link to="/cart">购物车</Link>, icon: <ShoppingCartOutlined /> },
    ...(user ? [
      { key: '/profile', label: <Link to="/profile">个人中心</Link> },
      { key: '/orders', label: <Link to="/orders">我的订单</Link> }
    ] : []),
    ...(user?.userType === 'SUPER_ADMIN' ? [{ key: '/admin', label: <Link to="/admin">管理</Link> }] : [])
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 800, letterSpacing: .3, marginRight: 24 }}>Online Ordering</div>
        <AntMenu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
          items={items}
          style={{ flex: 1, minWidth: 200, background: 'transparent' }}
        />
        <Space>
          {user ? (
            <>
              <Typography.Text style={{ color: '#fff' }}>你好，{user.name}</Typography.Text>
              <Button icon={<LogoutOutlined />} onClick={onLogout}>
                退出
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button icon={<LoginOutlined />}>登录</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">注册</Button>
              </Link>
            </>
          )}
        </Space>
      </Header>
      <Content style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:orderId" element={<OrderDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Online Ordering</Footer>
    </Layout>
  );
}


