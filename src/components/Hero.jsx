import React from 'react';
import { Link2, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center mb-16 relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
        <Sparkles className="w-4 h-4 text-purple-300" />
        <span className="text-sm text-purple-100">Free QR Code Generator</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Transform Links into
        <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
          Scannable QR Codes
        </span>
      </h1>
      
      <p className="text-2xl text-purple-200 font-semibold mb-4">
        with Link2QRpro
      </p>
      
      <p className="text-xl text-purple-100/80 max-w-2xl mx-auto leading-relaxed">
        Create professional QR codes instantly. Simply paste your link and download your custom QR code in seconds.
      </p>
    </div>
  );
}