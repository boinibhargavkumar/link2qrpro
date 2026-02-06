import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import Navigation from '../components/Navigation';
import LinkInput from '../components/master/LinkInput';
import ColorPicker from '../components/master/ColorPicker';
import QRGrid from '../components/master/QRGrid';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { validateColor, batchQrLimiter } from '../components/utils/security';
import SecurityHeaders from '../components/SecurityHeaders';
import { uploadFile } from "@/utils/fileUpload";

export default function MasterQR() {
  const [links, setLinks] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [qrColor, setQrColor] = useState('#1e1b4b');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoImage, setLogoImage] = useState(null);
  const fileInputRef = React.useRef(null);

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

  useEffect(() => {
    // SEO Meta Tags for Master QR Page
    document.title = "Master QR Generator - Batch QR Code Creator | Link2QRpro";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Generate multiple QR codes at once with Link2QRpro Master QR Generator. Batch create custom colored QR codes, rename them, and download all instantly. Free batch QR code generator.");
    }
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
      const { file_url } = await uploadFile(file);
      setLogoImage(file_url);
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    }
  };

  const generateAllQRCodes = async () => {
    if (links.length === 0) {
      toast.error('Please add at least one link');
      return;
    }

    if (links.length > 100) {
      toast.error('Maximum 100 QR codes can be generated at once');
      return;
    }

    // Rate limiting for batch operations
    if (!batchQrLimiter.canMakeRequest()) {
      const waitTime = Math.ceil(batchQrLimiter.getRemainingTime() / 1000);
      toast.error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
      return;
    }

    // Validate colors
    if (!validateColor(qrColor) || !validateColor(bgColor)) {
      toast.error('Invalid color format. Please use hex colors.');
      return;
    }

    setIsGenerating(true);
    const generatedQRs = [];

    try {
      for (const link of links) {
        let qrDataUrl = await QRCode.toDataURL(link.url, {
          width: 400,
          margin: 2,
          color: {
            dark: qrColor,
            light: bgColor,
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
                ctx.fillStyle = bgColor;
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

        generatedQRs.push({
          id: link.id,
          url: link.url,
          label: link.label,
          dataUrl: qrDataUrl,
        });
      }

      setQrCodes(generatedQRs);
      toast.success(`Successfully generated ${generatedQRs.length} QR codes!`);
    } catch (error) {
      toast.error('Failed to generate QR codes');
      console.error('Batch QR Error:', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <SecurityHeaders />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Batch QR Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Master QR Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate multiple QR codes at once with custom colors
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Links */}
          <div className="lg:col-span-2">
            <LinkInput links={links} setLinks={setLinks} />
          </div>

          {/* Right Column - Colors & Logo */}
          <div className="space-y-6">
            <ColorPicker
              qrColor={qrColor}
              setQrColor={setQrColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
            />

            {/* Logo Upload */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo (Optional)</h3>
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
                className="w-full mb-3"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo Image
              </Button>
              {logoImage && (
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <img src={logoImage} alt="Logo" className="w-12 h-12 object-cover rounded" />
                  <span className="text-sm text-gray-700 flex-1">Logo will be added to all QR codes</span>
                  <button
                    onClick={() => setLogoImage(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-12">
          <Button
            onClick={generateAllQRCodes}
            disabled={isGenerating || links.length === 0}
            className="h-14 px-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating {links.length} QR Codes...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate {links.length} QR Code{links.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>

        {/* QR Grid */}
        <QRGrid qrCodes={qrCodes} setQrCodes={setQrCodes} />
      </div>
    </div>
  );
}