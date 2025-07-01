
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (role: 'applicant' | 'admin', name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [applicantForm, setApplicantForm] = useState({ name: '', nik: '' });
  const [adminForm, setAdminForm] = useState({ username: '', password: '' });

  const handleApplicantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (applicantForm.name && applicantForm.nik) {
      toast.success('Login berhasil sebagai pemohon');
      onLogin('applicant', applicantForm.name);
    } else {
      toast.error('Mohon lengkapi semua field');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminForm.username === 'admin' && adminForm.password === 'admin123') {
      toast.success('Login berhasil sebagai admin');
      onLogin('admin', 'Administrator');
    } else {
      toast.error('Username atau password salah');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <LogIn className="h-6 w-6" />
          <span>Login ke Sistem</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="applicant" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applicant" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Pemohon</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicant">
            <form onSubmit={handleApplicantLogin} className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={applicantForm.name}
                  onChange={(e) => setApplicantForm({...applicantForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="Masukkan NIK (16 digit)"
                  value={applicantForm.nik}
                  onChange={(e) => setApplicantForm({...applicantForm, nik: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Masuk sebagai Pemohon
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username: admin"
                  value={adminForm.username}
                  onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password: admin123"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full">
                Masuk sebagai Admin
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Login;
