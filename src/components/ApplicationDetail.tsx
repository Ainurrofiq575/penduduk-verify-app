import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Image, Lock, CheckCircle, XCircle, Clock, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Application, updateApplicationStatus } from '@/utils/mockDatabase';
import DocumentViewer from './DocumentViewer';

interface ApplicationDetailProps {
  application: Application;
  onBack: () => void;
  isAdmin: boolean;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ application, onBack, isAdmin }) => {
  const [notes, setNotes] = useState(application.notes || '');
  const [processing, setProcessing] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    type: string;
    password?: string;
  } | null>(null);

  const handleDecision = async (status: 'approved' | 'rejected') => {
    if (!isAdmin) return;
    
    if (!notes.trim()) {
      toast.error('Mohon isi catatan sebelum memproses permohonan');
      return;
    }

    setProcessing(true);
    
    try {
      const success = updateApplicationStatus(application.id, status, notes, 'Administrator');
      
      if (success) {
        toast.success(`Permohonan berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
        onBack();
      } else {
        toast.error('Gagal memproses permohonan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat memproses permohonan');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-4 w-4 mr-2" />Menunggu Proses</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-4 w-4 mr-2" />Disetujui</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-4 w-4 mr-2" />Ditolak</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewDocument = (document: { name: string; type: string; password?: string }) => {
    setSelectedDocument(document);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Detail Permohonan</h1>
            {getStatusBadge(application.status)}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informasi Pemohon</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Nama Lengkap</p>
                      <p className="font-medium">{application.applicantName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">NIK</p>
                      <p className="font-medium">{application.nik}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Nomor Telepon</p>
                      <p className="font-medium">{application.phoneNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{application.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Alamat</p>
                      <p className="font-medium">{application.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Permohonan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Jenis Permohonan</p>
                  <p className="font-medium text-lg text-blue-600">{application.requestType.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Deskripsi/Keperluan</p>
                  <p className="text-gray-800">{application.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal Pengajuan</p>
                    <p className="font-medium">{application.submittedAt.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Dokumen Pendukung ({application.documents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {doc.type === 'application/pdf' ? (
                        <FileText className="h-6 w-6 text-red-600" />
                      ) : (
                        <Image className="h-6 w-6 text-blue-600" />
                      )}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                      {doc.password && (
                        <div className="flex items-center space-x-1 text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          <Lock className="h-3 w-3" />
                          <span>Password Protected</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                    >
                      Lihat
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Processing Information */}
          {application.status !== 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pemrosesan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="mt-1">{getStatusBadge(application.status)}</div>
                  </div>
                  {application.processedBy && (
                    <div>
                      <p className="text-sm text-gray-600">Diproses oleh</p>
                      <p className="font-medium">{application.processedBy}</p>
                    </div>
                  )}
                  {application.processedAt && (
                    <div>
                      <p className="text-sm text-gray-600">Tanggal Pemrosesan</p>
                      <p className="font-medium">{application.processedAt.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  )}
                  {application.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Catatan</p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded-lg mt-1">{application.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          {isAdmin && application.status === 'pending' && (
            <Card>
              <CardHeader>
                <CardTitle>Pemrosesan Permohonan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes">Catatan *</Label>
                    <Textarea
                      id="notes"
                      placeholder="Masukkan catatan untuk permohonan ini..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => handleDecision('approved')}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{processing ? 'Memproses...' : 'Setujui'}</span>
                    </Button>
                    <Button
                      onClick={() => handleDecision('rejected')}
                      disabled={processing}
                      variant="destructive"
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{processing ? 'Memproses...' : 'Tolak'}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default ApplicationDetail;
