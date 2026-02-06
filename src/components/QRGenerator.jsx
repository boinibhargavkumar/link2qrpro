import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Link2, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { validateURL, qrGenerationLimiter, sanitizeText } from './utils/security';
import { base44 } from '@/api/base44Client';

export default function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    // Load Adsterra popunder script
    const script = document.createElement('script');
    script.src = 'https://pl28648487.effectivegatecpm.com/80/b2/81/80b281411ebfcbbd490d25c640c75466.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setLogoImage(file_url);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    }
  };

  const generateQRCode = async () => {
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Rate limiting check
    if (!qrGenerationLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(qrGenerationLimiter.getRemainingTime() / 1000);
      toast.error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
      return;
    }

    // Validate URL with security utility
    const validation = validateURL(url);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsGenerating(true);
    
    try {
      let qrDataUrl = await QRCode.toDataURL(validation.url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#1e1b4b',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      });

      // Add logo if provided
      if (logoImage) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const qrImg = new Image();
        const logo = new Image();

        qrImg.crossOrigin = 'anonymous';
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve) => {
          qrImg.onload = async () => {
            canvas.width = qrImg.width;
            canvas.height = qrImg.height;
            ctx.drawImage(qrImg, 0, 0);

            logo.onload = () => {
              const logoSize = qrImg.width * 0.2;
              const centerX = qrImg.width / 2;
              const centerY = qrImg.height / 2;

              // Draw white background circle for logo
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(centerX, centerY, logoSize / 2 + 10, 0, 2 * Math.PI);
              ctx.fill();

              // Clip to circle for logo
              ctx.save();
              ctx.beginPath();
              ctx.arc(centerX, centerY, logoSize / 2, 0, 2 * Math.PI);
              ctx.clip();

              // Draw logo in circle
              const logoX = centerX - logoSize / 2;
              const logoY = centerY - logoSize / 2;
              ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
              ctx.restore();

              resolve();
            };
            logo.onerror = () => resolve();
            logo.src = logoImage;
          };
          qrImg.onerror = () => resolve();
          qrImg.src = qrDataUrl;
        });

        qrDataUrl = canvas.toDataURL();
      }
      
      setQrCodeUrl(qrDataUrl);
      toast.success('QR code generated!');
    } catch (error) {
      toast.error('Failed to generate QR code');
      console.error('QR Generation Error:', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrCodeUrl;
    link.click();
    toast.success('QR code downloaded!');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQRCode();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 md:p-12 max-w-3xl mx-auto">
      <div className="space-y-8">
        {/* Input Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Enter your URL
          </label>
          
          {/* Logo Upload */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              {logoImage ? 'Change Logo' : 'Add Logo (Optional)'}
            </Button>
            {logoImage && (
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <img src={logoImage} alt="Logo" className="w-8 h-8 object-cover rounded-full" />
                <button
                  onClick={() => setLogoImage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all"
              />
            </div>
            <Button
              onClick={generateQRCode}
              disabled={isGenerating}
              className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg"
              type="button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Enter any valid URL starting with http:// or https://
          </p>
        </div>

        {/* QR Code Display */}
        {qrCodeUrl && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 flex flex-col items-center">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className="w-64 h-64 md:w-80 md:h-80"
                />
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-1">Scan this QR code to visit:</p>
                <p className="text-sm font-medium text-indigo-600 break-all max-w-md">
                  {sanitizeText(url, 500)}
                </p>
              </div>
            </div>

            <Button
              onClick={downloadQRCode}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download QR Code
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}