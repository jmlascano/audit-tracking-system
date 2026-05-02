import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from 'axios';
import { useEffect, useState } from 'react';

interface OrgEventsParams {
  org_id: number; 
};

const OrgEvents = ({ org_id }: OrgEventsParams) => {
  const [events, setEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orgs/${org_id}/events`);
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch organization events:', err);
        setError('Failed to load events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [org_id]);

  return (
    <Card className="max-w-[350px] min-w-[250px] bg-gradient-to-br from-yellow-50 to-purple-50 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <CardHeader>
        <CardTitle>Events of this org:</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p>No events found for this organization.</p>
        ) : (
          <ul className="list-disc pl-5">
            {events.map((event, index) => (
              <li key={index}>{event}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgEvents;