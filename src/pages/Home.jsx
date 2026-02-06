import React, { useEffect } from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import QRGenerator from '../components/QRGenerator';
import Features from '../components/Features';
import FAQ from '../components/FAQ';
import SecurityHeaders from '../components/SecurityHeaders';

export default function Home() {
  useEffect(() => {
    // SEO Meta Tags
    document.title = "Link2QRpro - Free QR Code Generator | Create Custom QR Codes Instantly";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Generate professional QR codes for free with Link2QRpro. Create single or batch QR codes with custom colors. No registration required. High-quality, instant downloads for commercial use.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Generate professional QR codes for free with Link2QRpro. Create single or batch QR codes with custom colors. No registration required. High-quality, instant downloads for commercial use.";
      document.head.appendChild(meta);
    }

    // Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "QR code generator, free QR code, custom QR code, batch QR generator, QR code maker, create QR code, QR generator online, professional QR codes");
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = "QR code generator, free QR code, custom QR code, batch QR generator, QR code maker, create QR code, QR generator online, professional QR codes";
      document.head.appendChild(meta);
    }

    // Open Graph Tags
    const ogTags = [
      { property: "og:title", content: "Link2QRpro - Free Professional QR Code Generator" },
      { property: "og:description", content: "Create custom QR codes instantly. Free, no registration, unlimited generations." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Link2QRpro" }
    ];

    ogTags.forEach(tag => {
      let element = document.querySelector(`meta[property="${tag.property}"]`);
      if (element) {
        element.setAttribute("content", tag.content);
      } else {
        element = document.createElement('meta');
        element.setAttribute("property", tag.property);
        element.setAttribute("content", tag.content);
        document.head.appendChild(element);
      }
    });

    // Twitter Card Tags
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Link2QRpro - Free QR Code Generator" },
      { name: "twitter:description", content: "Generate professional QR codes for free. Custom colors, batch processing, instant downloads." }
    ];

    twitterTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (element) {
        element.setAttribute("content", tag.content);
      } else {
        element = document.createElement('meta');
        element.setAttribute("name", tag.name);
        element.setAttribute("content", tag.content);
        document.head.appendChild(element);
      }
    });

    // Structured Data (JSON-LD)
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Link2QRpro",
      "applicationCategory": "Utility",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Free professional QR code generator with custom colors and batch processing capabilities",
      "featureList": [
        "Free QR code generation",
        "Batch QR code creation",
        "Custom color options",
        "High-resolution downloads",
        "No registration required",
        "Commercial use allowed"
      ]
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(structuredData);
    } else {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(structuredData);
      document.head.appendChild(scriptTag);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = window.location.href;
      document.head.appendChild(canonical);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <SecurityHeaders />
      <Navigation />
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <Hero />
          <QRGenerator />
          <Features />
          <FAQ />
          
          {/* Footer */}
          <div className="mt-24 text-center border-t border-white/10 pt-8">
            <p className="text-purple-200/60 text-sm mb-2">
              © 2026 Link2QRpro • Free QR Code Generator • No Registration Required
            </p>
            <p className="text-purple-200/40 text-xs">
              All QR codes are generated securely in your browser. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}