import { Suspense } from 'react';
import LogTable from '@/components/LogTable';
import LogFilters from '@/components/LogFilters';
import { headers } from 'next/headers';

async function getLogs(searchParams: Record<string, string>) {
  // Construct the URL with query parameters
  const url = new URL(`${process.env.NEXT_LOCALURL}/api/logs`);
  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Fetch the authorization header
  const authHeader = (await headers()).get('Authorization') || '';

  // Make the API request
  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': authHeader,
    },
  });

  if (!response.ok) {
    console.log('Failed to fetch logs');
  }

  return response.json();
}

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  // Pass searchParams directly as an object
  const initialLogs = await getLogs(searchParams);

  async function deletelog(id: string) {
    'use server';
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': (await headers()).get('Authorization') || '',
      },
    });

    if (!response.ok) {
      console.log('Failed to delete log');
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
