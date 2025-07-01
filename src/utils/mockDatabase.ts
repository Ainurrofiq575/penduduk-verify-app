
export interface Application {
  id: string;
  applicantName: string;
  nik: string;
  phoneNumber: string;
  email: string;
  address: string;
  requestType: string;
  description: string;
  documents: {
    name: string;
    type: string;
    password?: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  notes?: string;
  processedBy?: string;
  processedAt?: Date;
}

// Mock database
let applications: Application[] = [
  {
    id: '1',
    applicantName: 'John Doe',
    nik: '1234567890123456',
    phoneNumber: '081234567890',
    email: 'john@example.com',
    address: 'Jl. Contoh No. 123, Jakarta',
    requestType: 'verifikasi_ktp',
    description: 'Verifikasi KTP untuk keperluan administrasi bank',
    documents: [
      { name: 'KTP_John_Doe.pdf', type: 'application/pdf', password: 'password123' },
      { name: 'Foto_Selfie.jpg', type: 'image/jpeg' }
    ],
    status: 'pending',
    submittedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    applicantName: 'Jane Smith',
    nik: '9876543210987654',
    phoneNumber: '087654321098',
    email: 'jane@example.com',
    address: 'Jl. Dummy No. 456, Bandung',
    requestType: 'verifikasi_kk',
    description: 'Verifikasi Kartu Keluarga untuk pendaftaran sekolah anak',
    documents: [
      { name: 'KK_Jane_Smith.pdf', type: 'application/pdf', password: 'mypassword' }
    ],
    status: 'approved',
    submittedAt: new Date('2024-01-10'),
    notes: 'Dokumen lengkap dan valid',
    processedBy: 'Administrator',
    processedAt: new Date('2024-01-12'),
  }
];

export const getApplications = (): Application[] => {
  return applications;
};

export const getApplicationById = (id: string): Application | undefined => {
  return applications.find(app => app.id === id);
};

export const addApplication = (application: Omit<Application, 'id' | 'submittedAt'>): Application => {
  const newApplication: Application = {
    ...application,
    id: Date.now().toString(),
    submittedAt: new Date(),
  };
  applications.push(newApplication);
  return newApplication;
};

export const updateApplicationStatus = (
  id: string, 
  status: 'approved' | 'rejected', 
  notes: string,
  processedBy: string
): boolean => {
  const applicationIndex = applications.findIndex(app => app.id === id);
  if (applicationIndex !== -1) {
    applications[applicationIndex] = {
      ...applications[applicationIndex],
      status,
      notes,
      processedBy,
      processedAt: new Date(),
    };
    return true;
  }
  return false;
};

export const getApplicationsByApplicant = (applicantName: string): Application[] => {
  return applications.filter(app => app.applicantName === applicantName);
};
