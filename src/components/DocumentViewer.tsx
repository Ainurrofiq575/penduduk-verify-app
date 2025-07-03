
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Image, X } from 'lucide-react';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    type: string;
    password?: string;
  };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ isOpen, onClose, document }) => {
  const isImage = document.type.startsWith('image/');
  const isPDF = document.type === 'application/pdf';

  // Simulasi URL dokumen (dalam aplikasi nyata, ini akan berupa URL yang sebenarnya)
  const getDocumentUrl = () => {
    if (isImage) {
      // Menggunakan placeholder image untuk demo
      return '/placeholder.svg';
    }
    return '#'; // Placeholder untuk PDF
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {isImage ? (
              <Image className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            <span>{document.name}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {isImage ? (
            <div className="flex justify-center p-4">
              <img
                src={getDocumentUrl()}
                alt={document.name}
                className="max-w-full max-h-[60vh] object-contain rounded-lg border"
              />
            </div>
          ) : isPDF ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="text-gray-600 text-center">
                Preview PDF tidak tersedia dalam demo ini.
                <br />
                Dalam aplikasi nyata, dokumen PDF akan ditampilkan di sini.
              </p>
              {document.password && (
                <p className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded">
                  Dokumen ini dilindungi password: {document.password}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <FileText className="h-16 w-16 text-gray-400" />
              <p className="text-gray-600 text-center">
                Format dokumen tidak didukung untuk preview.
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
