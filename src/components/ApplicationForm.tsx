
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, FileText, Image, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { addApplication } from '@/utils/mockDatabase';

interface ApplicationFormProps {
  onBack: () => void;
  onSubmitted: () => void;
  applicantName: string;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onBack, onSubmitted, applicantName }) => {
  const [formData, setFormData] = useState({
    nik: '',
    phoneNumber: '',
    email: '',
    address: '',
    requestType: '',
    description: '',
  });

  const [documents, setDocuments] = useState<Array<{
    name: string;
    type: string;
    password?: string;
  }>>([]);

  const [documentPassword, setDocumentPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nik || !formData.phoneNumber || !formData.email || !formData.address || !formData.requestType || !formData.description) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (documents.length === 0) {
      toast.error('Mohon upload minimal satu dokumen pendukung');
      return;
    }

    try {
      addApplication({
        applicantName,
        ...formData,
        documents,
        status: 'pending',
      });

      toast.success('Permohonan berhasil diajukan!');
      onSubmitted();
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengajukan permohonan');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDocument = {
          name: file.name,
          type: file.type,
          password: file.type === 'application/pdf' && documentPassword ? documentPassword : undefined,
        };
        setDocuments(prev => [...prev, newDocument]);
      });
      setDocumentPassword('');
      toast.success(`${files.length} dokumen berhasil ditambahkan`);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
    toast.success('Dokumen dihapus');
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
            <h1 className="text-2xl font-bold text-gray-900">Form Permohonan Verifikasi Data</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Formulir Permohonan Verifikasi Data Penduduk</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nik">NIK *</Label>
                  <Input
                    id="nik"
                    type="text"
                    placeholder="16 digit NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value})}
                    maxLength={16}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea
                  id="address"
                  placeholder="Masukkan alamat lengkap sesuai KTP"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              </div>

              {/* Request Type */}
              <div>
                <Label htmlFor="requestType">Jenis Permohonan *</Label>
                <Select value={formData.requestType} onValueChange={(value) => setFormData({...formData, requestType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis permohonan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verifikasi_ktp">Verifikasi KTP</SelectItem>
                    <SelectItem value="verifikasi_kk">Verifikasi Kartu Keluarga</SelectItem>
                    <SelectItem value="verifikasi_akta_lahir">Verifikasi Akta Kelahiran</SelectItem>
                    <SelectItem value="verifikasi_akta_nikah">Verifikasi Akta Pernikahan</SelectItem>
                    <SelectItem value="verifikasi_data_lengkap">Verifikasi Data Lengkap</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi/Keperluan *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan keperluan verifikasi data (misal: untuk keperluan bank, sekolah, dll)"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <div>
                  <Label>Dokumen Pendukung *</Label>
                  <p className="text-sm text-gray-600 mb-2">Upload dokumen dalam format PDF atau JPG/JPEG</p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-4">Drag & drop files atau klik untuk browse</p>
                      
                      {/* Password for PDF */}
                      <div className="mb-4">
                        <Label htmlFor="docPassword" className="text-sm">Password untuk dokumen PDF (opsional)</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Lock className="h-4 w-4 text-gray-400" />
                          <Input
                            id="docPassword"
                            type="password"
                            placeholder="Masukkan password jika dokumen PDF terproteksi"
                            value={documentPassword}
                            onChange={(e) => setDocumentPassword(e.target.value)}
                            className="max-w-sm"
                          />
                        </div>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                        Pilih File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Uploaded Documents */}
                {documents.length > 0 && (
                  <div className="space-y-2">
                    <Label>Dokumen yang telah diupload:</Label>
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          {doc.type === 'application/pdf' ? (
                            <FileText className="h-4 w-4 text-red-600" />
                          ) : (
                            <Image className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-sm font-medium">{doc.name}</span>
                          {doc.password && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Lock className="h-3 w-3" />
                              <span>Protected</span>
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Hapus
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Batal
                </Button>
                <Button type="submit">
                  Ajukan Permohonan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationForm;
