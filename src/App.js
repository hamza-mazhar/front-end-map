import MapComponent from "./containers/mapContainer";
import { Layout, Menu} from 'antd';
const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key={1}>Home</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">  <MapComponent/></div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created By Hamza</Footer>
    </Layout>
  );
}

export default App;
