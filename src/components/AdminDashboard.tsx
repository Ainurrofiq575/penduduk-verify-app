
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, FileText, Clock, CheckCircle, XCircle, LogOut, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ApplicationDetail from './ApplicationDetail';
import { getApplications, Application } from '@/utils/mockDatabase';

interface AdminDashboardProps {
  user: { role: 'applicant' | 'admin', name: string };
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [applications, setApplications] = useState<Application[]>(getApplications());
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleApplicationUpdate = () => {
    setApplications(getApplications());
    setSelectedApplication(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.nik.includes(searchTerm) ||
                         app.requestType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Menunggu</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (selectedApplication) {
    return (
      <ApplicationDetail 
        application={selectedApplication} 
        onBack={handleApplicationUpdate} 
        isAdmin={true}
      />
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">Selamat datang, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Permohonan</p>
                  <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Proses</p>
                  <p className="text-2xl font-bold text-yellow-600">{applications.filter(a => a.status === 'pending').length}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-green-600">{applications.filter(a => a.status === 'approved').length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-red-600">{applications.filter(a => a.status === 'rejected').length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari berdasarkan nama, NIK, atau jenis permohonan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tidak ada permohonan yang sesuai dengan filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedApplication(application)}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                        <p className="text-sm text-gray-600">NIK: {application.nik}</p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-600">{application.requestType.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-sm text-gray-500">{application.documents.length} dokumen</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{application.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Diajukan: {application.submittedAt.toLocaleDateString('id-ID')}</span>
                      {application.processedAt && (
                        <span>Diproses: {application.processedAt.toLocaleDateString('id-ID')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
