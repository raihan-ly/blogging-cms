import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicFeed from './pages/PublicFeed';
import Dashboard from './pages/Dashboard';
import PostDetail from './pages/PostDetail';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PublicFeed />} />
        <Route path="/posts/:id" element={<PostDetail />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
