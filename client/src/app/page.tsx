"use client";

import { useEffect, useState } from 'react';

interface EventData {
  message: string;
  timestamp: string;
}

export default function Home() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToEventSource = () => {
      setError(null);
      
      try {
        // Connect to the SSE endpoint
        eventSource = new EventSource('http://localhost:3001/events');
        
        // Handle connection open
        eventSource.onopen = () => {
          setIsConnected(true);
          console.log('SSE connection established');
        };
        
        // Handle 'update' events
        eventSource.addEventListener('update', (e) => {
          try {
            const data = JSON.parse(e.data) as EventData;
            setEvents((prevEvents) => [data, ...prevEvents].slice(0, 20)); // Keep last 20 events
          } catch (err) {
            console.error('Error parsing event data:', err);
          }
        });
        
        // Handle errors
        eventSource.onerror = (e) => {
          console.error('SSE error:', e);
          setError('Connection to event stream failed. Retrying...');
          setIsConnected(false);
          
          // Close the connection
          if (eventSource) {
            eventSource.close();
          }
          
          // Try to reconnect after a delay
          setTimeout(connectToEventSource, 3000);
        };
      } catch (err) {
        console.error('Error setting up EventSource:', err);
        setError(`Failed to connect: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    connectToEventSource();

    // Clean up function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } catch (e) {
      return dateString;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8">
      <h1 className="text-4xl font-bold mb-8">Hono SSE Event Stream</h1>
      
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center mb-4">
          <div 
            className={`w-4 h-4 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
          />
          <span>
            {isConnected ? 'Connected to event stream' : 'Disconnected from event stream'}
          </span>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
      </div>
      
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Recent Events</h2>
        
        {events.length === 0 ? (
          <p className="text-gray-500">Waiting for events...</p>
        ) : (
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="border rounded p-4 transition-opacity duration-500 animate-fade-in">
                <p className="font-medium">{event.message}</p>
                <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
