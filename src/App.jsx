import { useRef } from "react";
import { SidebarProvider, useSidebar } from "./Context/SidebarContext";
import { useSwipe } from "./Hooks/useSwipe";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Overlay from "./Components/Overlay";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Sales from "./Pages/Sales";

function AppContent() {
  const { isSidebarVisible, closeSidebar } = useSidebar();
  const sidebarRef = useRef();

  useSwipe(closeSidebar, isSidebarVisible, 50, sidebarRef);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div ref={sidebarRef} className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
        <Sidebar />
      </div>

      {/* Overlay */}
      {isSidebarVisible && <Overlay onClick={closeSidebar} />}

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header /> {/* No need to pass toggleSidebar as a prop */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SidebarProvider>
      <Router>
        <AppContent />
      </Router>
    </SidebarProvider>
  );
}