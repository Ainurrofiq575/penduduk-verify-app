
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, Shield, CheckCircle } from 'lucide-react';
import Login from '@/components/Login';
import ApplicantDashboard from '@/components/ApplicantDashboard';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ role: 'applicant' | 'admin', name: string } | null>(null);

  const handleLogin = (role: 'applicant' | 'admin', name: string) => {
    setCurrentUser({ role, name });
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (currentUser) {
    return currentUser.role === 'applicant' ? (
      <ApplicantDashboard user={currentUser} onLogout={handleLogout} />
    ) : (
      <AdminDashboard user={currentUser} onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Sistem Verifikasi Data Penduduk
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Verifikasi dan Validasi Data Penduduk
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sistem digital untuk memudahkan proses verifikasi data kependudukan
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pengajuan Online</h3>
              <p className="text-gray-600">Ajukan permohonan verifikasi data secara online dengan mudah</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manajemen Admin</h3>
              <p className="text-gray-600">Dashboard admin untuk mengelola dan memproses permohonan</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tracking Status</h3>
              <p className="text-gray-600">Pantau status permohonan Anda secara real-time</p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="max-w-md mx-auto">
          <Login onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Index;
