import React from 'react';
import { Zap, Shield, Download, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Create QR codes in milliseconds with our optimized generator'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays private. We never store your URLs or QR codes'
  },
  {
    icon: Download,
    title: 'High Quality',
    description: 'Download crisp, high-resolution QR codes ready for any use'
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Works perfectly on any device, from desktop to mobile'
  }
];

export default function Features() {
  return (
    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center mb-4">
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {feature.title}
          </h3>
          <p className="text-purple-100/70 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}