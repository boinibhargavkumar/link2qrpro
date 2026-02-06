import React, { useState } from 'react';
import { Download, ExternalLink, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { sanitizeFilename, sanitizeText } from '../utils/security';

export default function QRGrid({ qrCodes, setQrCodes }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const downloadQRCode = (qrCode) => {
    const fileName = sanitizeFilename(
      qrCode.customName || qrCode.label || `qrcode-${qrCode.id}`
    );
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = qrCode.dataUrl;
    link.click();
    toast.success('QR code downloaded!');
  };

  const startEditing = (qrCode) => {
    setEditingId(qrCode.id);
    setEditName(qrCode.customName || qrCode.label || '');
  };

  const saveCustomName = (id) => {
    const sanitized = sanitizeFilename(editName);
    if (!sanitized) {
      toast.error('Invalid filename');
      return;
    }
    
    setQrCodes(qrCodes.map(qr => 
      qr.id === id ? { ...qr, customName: sanitized } : qr
    ));
    setEditingId(null);
    setEditName('');
    toast.success('QR code renamed!');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const downloadAll = () => {
    // Limit batch downloads
    if (qrCodes.length > 100) {
      toast.error('Cannot download more than 100 QR codes at once');
      return;
    }

    qrCodes.forEach((qrCode, index) => {
      setTimeout(() => {
        const fileName = sanitizeFilename(
          qrCode.customName || qrCode.label || `qrcode-${qrCode.id}`
        );
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = qrCode.dataUrl;
        link.click();
      }, index * 200);
    });
    toast.success(`Downloading ${qrCodes.length} QR codes...`);
  };

  if (qrCodes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          Generated QR Codes ({qrCodes.length})
        </h3>
        <Button
          onClick={downloadAll}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {qrCodes.map((qrCode) => (
          <div
            key={qrCode.id}
            className="border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-3 flex items-center justify-center">
              <img
                src={qrCode.dataUrl}
                alt={qrCode.customName || qrCode.label || 'QR Code'}
                className="w-48 h-48 object-contain"
              />
            </div>

            {/* Custom Name / Label */}
            <div className="mb-3">
              {editingId === qrCode.id ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveCustomName(qrCode.id)}
                    placeholder="Enter QR name"
                    className="text-sm h-8"
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                    onClick={() => saveCustomName(qrCode.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:bg-red-50"
                    onClick={cancelEditing}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-gray-800 truncate flex-1">
                    {qrCode.customName || qrCode.label || 'Untitled QR'}
                  </h4>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                    onClick={() => startEditing(qrCode)}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <p className="truncate">{sanitizeText(qrCode.url, 500)}</p>
            </div>

            <Button
              onClick={() => downloadQRCode(qrCode)}
              variant="outline"
              className="w-full group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-300"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}