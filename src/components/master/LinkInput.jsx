import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateURL, sanitizeText, generateSecureId } from '../utils/security';

export default function LinkInput({ links, setLinks }) {
  const [newLink, setNewLink] = useState('');

  const addLink = () => {
    if (!newLink.trim()) {
      return;
    }

    // Limit number of links to prevent abuse
    if (links.length >= 100) {
      toast.error('Maximum 100 links allowed');
      return;
    }

    const validation = validateURL(newLink);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setLinks([...links, { 
      id: generateSecureId(), 
      url: validation.url, 
      label: '' 
    }]);
    setNewLink('');
  };

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const updateLabel = (id, label) => {
    const sanitizedLabel = sanitizeText(label, 100);
    setLinks(links.map(link => 
      link.id === id ? { ...link, label: sanitizedLabel } : link
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addLink();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Links</h3>
      
      {/* Add new link */}
      <div className="flex gap-2 mb-6">
        <Input
          type="url"
          placeholder="https://example.com"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={addLink}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* List of links */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No links added yet. Add your first link above!
          </p>
        ) : (
          links.map((link) => (
            <div key={link.id} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
              <div className="flex-1 space-y-2">
                <Input
                  type="text"
                  placeholder="Label (optional)"
                  value={link.label}
                  onChange={(e) => updateLabel(link.id, e.target.value)}
                  className="text-sm"
                />
                <p className="text-xs text-gray-600 break-all px-1">{sanitizeText(link.url, 500)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLink(link.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {links.length > 0 && (
        <p className="text-sm text-gray-500 mt-4">
          {links.length} link{links.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}