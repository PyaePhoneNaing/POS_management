import { NavLink } from 'react-router-dom';
import '../Styles/Sidebar.styles.scss';

const navigation = [
  { name: 'Dashboard', href: '/', icon: 'bi-house' },
  { name: 'Sales', href: '/sales', icon: 'bi-bar-chart' },
];
export default function SidebarContent({ onClose }){
    return (
        <>
        <div className="sidebar-header border-bottom">
        <img src="#" alt="Logo" className="sidebar-logo" />
      </div>
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${
                isActive ? 'active-link' : 'inactive-link'
              }`
            }
            onClick={onClose}
          >
            <i className={`bi ${item.icon} me-3`}></i>
            {item.name}
          </NavLink>
        ))}
      </nav>
      </>
    )
}