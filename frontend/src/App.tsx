import { Layout, Menu as AntMenu, Button, Typography, Space, message } from 'antd';
import { ShoppingCartOutlined, AppstoreOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from '@pages/Login';
import Register from '@pages/Register';
import MenuPage from '@pages/Menu';
import CartPage from '@pages/Cart';
import Checkout from '@pages/Checkout';
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
    { key: '/cart', label: <Link to="/cart">购物车</Link>, icon: <ShoppingCartOutlined /> }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 700, marginRight: 24 }}>Online Ordering</div>
        <AntMenu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname === '/' ? '/' : location.pathname]}
          items={items}
          style={{ flex: 1, minWidth: 200 }}
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
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© {new Date().getFullYear()} Online Ordering</Footer>
    </Layout>
  );
}


