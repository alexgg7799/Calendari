import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const EventComponent = ({ event, handleCheckboxChange, handleEditNote, handleDeleteNote }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(event.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    handleEditNote(event.id, editedTitle);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(event.title);
  };

  const handleDelete = () => {
    handleDeleteNote(event.id);
  };

  return (
    <div className="event">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      ) : (
        <div>
          <strong>{event.title}</strong>
          <br />
          <label>
            <input
              type="checkbox"
              checked={event.checkedYes}
              onChange={() => handleCheckboxChange(event, 'yes')}
            />{' '}
            Sí
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={event.checkedNo}
              onChange={() => handleCheckboxChange(event, 'no')}
            />{' '}
            No
          </label>
          <br />
          <button onClick={handleEdit}>Editar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setEvents(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(events));
  }, [events]);

  const handleSelectSlot = (slotInfo) => {
    const title = window.prompt('Ingrese el título del evento:');
    if (title) {
      const newEvent = {
        id: generateUniqueId(),
        start: slotInfo.start,
        end: slotInfo.end,
        title: title,
        checkedYes: false,
        checkedNo: false,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleCheckboxChange = (event, type) => {
    const updatedEvents = events.map((e) => {
      if (e === event) {
        return { ...e, checkedYes: type === 'yes', checkedNo: type === 'no' };
      }
      return e;
    });
    setEvents(updatedEvents);
  };

  const handleEditNote = (eventId, newTitle) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return { ...event, title: newTitle };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleDeleteNote = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  return (
    <div className="app">
      <h1>Calendario Editable</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: '100vh' }}
        components={{
          event: (props) => (
            <EventComponent
              {...props}
              handleCheckboxChange={handleCheckboxChange}
              handleEditNote={handleEditNote}
              handleDeleteNote={handleDeleteNote}
            />
          ),
        }}
      />
    </div>
  );
};

export default App;
