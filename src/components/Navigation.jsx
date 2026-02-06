import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { QrCode, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/' || location.pathname === '/Home';
  const isMasterQR = location.pathname === '/MasterQR';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Link2QRpro</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to={createPageUrl('Home')}>
              <Button 
                variant={isHome ? "default" : "ghost"} 
                className={isHome ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"}
              >
                Single QR
              </Button>
            </Link>
            <Link to={createPageUrl('MasterQR')}>
              <Button 
                variant={isMasterQR ? "default" : "ghost"}
                className={isMasterQR ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "text-gray-700 hover:bg-gray-100"}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Master QR
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}