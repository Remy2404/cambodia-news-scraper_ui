import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { ArticleDetails } from './pages/ArticleDetails';
import { CreateArticle } from './pages/CreateArticle';
import { EditArticle } from './pages/EditArticle';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/articles/:id" element={<ArticleDetails />} />
            <Route path="/articles/:id/edit" element={<EditArticle />} />
            <Route path="/create" element={<CreateArticle />} />
          </Routes>
        </Layout>
      </Router>
    </ToastProvider>
  );
}

export default App;
