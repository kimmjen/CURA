import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CollectionPage } from './pages/CollectionPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCreateCollection } from './pages/admin/AdminCreateCollection';
import { AdminCollectionDetail } from './pages/admin/AdminCollectionDetail';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';
import { StyleGuidePage } from './pages/StyleGuidePage';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/collection/1" replace />} />

        {/* Public Routes with Layout */}
        <Route path="/collection/:id" element={
          <MainLayout>
            <CollectionPage />
          </MainLayout>
        } />

        <Route path="/style-guide" element={<StyleGuidePage />} />

        {/* Admin Routes (Self-contained Layout) */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/create" element={<AdminCreateCollection />} />
        <Route path="/admin/collections/:id" element={<AdminCollectionDetail />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
