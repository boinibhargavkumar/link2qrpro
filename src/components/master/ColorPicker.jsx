import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Palette } from 'lucide-react';

const presetColors = {
  qr: [
    { name: 'Classic Black', value: '#000000' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Purple', value: '#7e22ce' },
    { name: 'Pink', value: '#db2777' },
    { name: 'Green', value: '#059669' },
    { name: 'Orange', value: '#ea580c' },
  ],
  bg: [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f3f4f6' },
    { name: 'Light Blue', value: '#dbeafe' },
    { name: 'Light Purple', value: '#f3e8ff' },
    { name: 'Light Pink', value: '#fce7f3' },
    { name: 'Light Green', value: '#d1fae5' },
  ]
};

export default function ColorPicker({ qrColor, setQrColor, bgColor, setBgColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Customize Colors</h3>
      </div>

      <div className="space-y-6">
        {/* QR Code Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">QR Code Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={qrColor}
              onChange={(e) => setQrColor(e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={qrColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                  setQrColor(value);
                }
              }}
              className="flex-1 font-mono text-sm"
              placeholder="#000000"
              maxLength={7}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presetColors.qr.map((color) => (
              <button
                key={color.value}
                onClick={() => setQrColor(color.value)}
                className={`h-10 rounded-lg border-2 transition-all ${
                  qrColor === color.value ? 'border-indigo-500 scale-95' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={bgColor}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value) || value === '') {
                  setBgColor(value);
                }
              }}
              className="flex-1 font-mono text-sm"
              placeholder="#ffffff"
              maxLength={7}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presetColors.bg.map((color) => (
              <button
                key={color.value}
                onClick={() => setBgColor(color.value)}
                className={`h-10 rounded-lg border-2 transition-all ${
                  bgColor === color.value ? 'border-indigo-500 scale-95' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="pt-4 border-t">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
          <div className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300">
            <div 
              className="w-20 h-20 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <div 
                className="w-16 h-16 rounded-md grid grid-cols-4 gap-1 p-1"
              >
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className="rounded-sm"
                    style={{ backgroundColor: qrColor }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}