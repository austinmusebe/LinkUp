import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date)
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate('/');
      } else {
        setError(data.error || 'Failed to create event');
      }
    } catch (err) {
      setError('Unable to create event');
      console.error('Create error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create New Event</h2>
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#f8d7da', 
          borderRadius: '8px', 
          marginBottom: '1rem' 
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button 
            type="button"
            onClick={() => navigate('/')}
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;