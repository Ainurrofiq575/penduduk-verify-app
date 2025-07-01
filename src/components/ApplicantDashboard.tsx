
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, XCircle, LogOut, User } from 'lucide-react';
import ApplicationForm from './ApplicationForm';
import ApplicationDetail from './ApplicationDetail';
import { getApplicationsByApplicant, Application } from '@/utils/mockDatabase';

interface ApplicantDashboardProps {
  user: { role: 'applicant' | 'admin', name: string };
  onLogout: () => void;
}

const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({ user, onLogout }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>(
    getApplicationsByApplicant(user.name)
  );

  const handleApplicationSubmitted = () => {
    setShowForm(false);
    setApplications(getApplicationsByApplicant(user.name));
  };

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

  if (showForm) {
    return <ApplicationForm onBack={() => setShowForm(false)} onSubmitted={handleApplicationSubmitted} applicantName={user.name} />;
  }

  if (selectedApplication) {
    return <ApplicationDetail application={selectedApplication} onBack={() => setSelectedApplication(null)} isAdmin={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Pemohon</h1>
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
                  <p className="text-sm font-medium text-gray-600">Menunggu</p>
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

        {/* Action Button */}
        <div className="mb-6">
          <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Ajukan Permohonan Baru</span>
          </Button>
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan Saya</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada permohonan. Klik tombol di atas untuk mengajukan permohonan pertama Anda.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => setSelectedApplication(application)}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{application.requestType.replace('_', ' ').toUpperCase()}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-gray-600 mb-2">{application.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Diajukan: {application.submittedAt.toLocaleDateString('id-ID')}</span>
                      <span>{application.documents.length} dokumen</span>
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

export default ApplicantDashboard;
