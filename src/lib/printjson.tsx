import { useAuth } from '@/auth/context/AuthProvider';
import React from 'react';

interface PrintJsonProps {
  data: any; // Anda bisa mengganti `any` dengan tipe data yang lebih spesifik
}

const PrintJson: React.FC<PrintJsonProps> = ({ data }) => {
  const { hasRole } = useAuth()
  
  // Munculkan jika sedang di mode development (Vite) ATAU user punya role 'dev'
  if(import.meta.env.DEV || hasRole("dev")) {
    return (
      <>
          <details className="bg-gray-50 border rounded">
            <summary className="p-4 cursor-pointer font-medium">
              📋 Raw API Response (Click to expand)
            </summary>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
      </>
    );
  }

  return null;
};

export default PrintJson;
