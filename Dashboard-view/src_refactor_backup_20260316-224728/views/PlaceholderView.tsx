import React from 'react';

export function PlaceholderView({ title, icon: Icon }: any) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Icon size={48} className="text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        This module is currently being integrated. You'll soon be able to track your {String(title).toLowerCase()} metrics, campaigns, and performance data right here.
      </p>
      <button className="mt-8 bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-colors" type="button">
        Request Early Access
      </button>
    </div>
  );
}

