// src/app/logs/page.tsx
import { Suspense } from 'react';
import LogTable from '@/components/LogTable';
import LogFilters from '@/components/LogFilters';
import { headers } from 'next/headers';

async function getLogs(searchParams: URLSearchParams) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs?${searchParams}`, {
    headers: {
      'Authorization': headers().get('Authorization') || '',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch logs');
  }
  
  return response.json();
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const initialLogs = await getLogs(new URLSearchParams(searchParams as Record<string, string>));

  async function deletelog(id: string) {
    'use server';
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': headers().get('Authorization') || '',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete log');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and manage system activity logs
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <LogFilters onFilter={async (filters) => {
          'use server';
          // Handle filter updates
        }} />
      </Suspense>

      <Suspense fallback={<div>Loading logs...</div>}>
        <LogTable 
          initialLogs={initialLogs.logs} 
          onDelete={deletelog}
        />
      </Suspense>
    </div>
  );
}