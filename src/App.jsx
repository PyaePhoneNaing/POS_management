import { useRef, useEffect } from "react";
import { SidebarProvider, useSidebar } from "./Context/SidebarContext";
import useIsMobile from "./Hooks/useIsMobile";
import { useSwipe } from "./Hooks/useSwipe";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Overlay from "./Components/Overlay";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Sales from "./Pages/Sales";

function AppContent() {
  const { isSidebarVisible, closeSidebar } = useSidebar();
  const sidebarRef = useRef();
  const location = useLocation();
  const isMobile = useIsMobile();
  useSwipe(closeSidebar, isSidebarVisible, 50, sidebarRef);

  return (
    

    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar ref={sidebarRef} isSidebarVisible={isSidebarVisible} onClose={closeSidebar} />



      {/* Main Content */}
      <div className="flex-grow-1">
        <Header />
        <div className="content ">
          <Routes>
            <Route path="/" element={<Dashboard />} />
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