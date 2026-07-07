import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import ProductFormPage from '../pages/ProductFormPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryFormPage from '../pages/CategoryFormPage';
import RangesPage from '../pages/RangesPage';
import RangeFormPage from '../pages/RangeFormPage';
import ReceiptsPage from '../pages/ReceiptsPage';
import ReceiptDetailPage from '../pages/ReceiptDetailPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import ProductRangePage from '../pages/ProductRangePage';
import ProductRangeFormPage from '../pages/ProductRangeFormPage';
import StatisticsPage from '../pages/StatisticsPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/new" element={<CategoryFormPage />} />
        <Route path="categories/:id/edit" element={<CategoryFormPage />} />
        <Route path="ranges" element={<RangesPage />} />
        <Route path="ranges/new" element={<RangeFormPage />} />
        <Route path="ranges/:id/edit" element={<RangeFormPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route path="receipts/:id" element={<ReceiptDetailPage />} />
        <Route path="shopping-list" element={<ShoppingListPage />} />
        <Route path="product-range" element={<ProductRangePage />} />
        <Route path="product-range/new" element={<ProductRangeFormPage />} />
        <Route path="product-range/:id/edit" element={<ProductRangeFormPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
    </Routes>
  );
}
