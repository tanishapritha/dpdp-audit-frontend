import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import UploadPage from './pages/Upload';
import StatusPage from './pages/Status';
import ReportPage from './pages/Report';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Home />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/upload"
                        element={
                            <ProtectedRoute requiredRole="ANALYST">
                                <Layout>
                                    <UploadPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/status/:policyId"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <StatusPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/report/:policyId"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ReportPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <Layout>
                                    <AdminDashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
