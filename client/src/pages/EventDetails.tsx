import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  createdAt: string;
}

function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/events/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setEvent(data.data);
        } else {
          setError(data.error || 'Event not found');
        }
      } catch (err) {
        setError('Unable to fetch event details');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error || !event) {
    return (
      <div>
        <div style={{ padding: '1rem', background: '#f8d7da', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>❌ Error:</strong> {error || 'Event not found'}
        </div>
        <Link to="/">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div>
      <button 
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1rem', cursor: 'pointer' }}
      >
        ← Back
      </button>
      
      <div style={{ 
        border: '1px solid #ddd', 
        padding: '2rem', 
        borderRadius: '8px',
        textAlign: 'left'
      }}>
        <h2 style={{ marginTop: 0 }}>{event.title}</h2>
        
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          color: '#666'
        }}>
          <span>📅 {new Date(event.date).toLocaleString()}</span>
          {event.location && <span>📍 {event.location}</span>}
        </div>
        
        {event.description && (
          <div style={{ lineHeight: '1.6' }}>
            <h3>About this event</h3>
            <p>{event.description}</p>
          </div>
        )}
        
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid #eee',
          fontSize: '0.9rem',
          color: '#999'
        }}>
          Created: {new Date(event.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;