import { useState, useEffect, useCallback } from 'react';
import { FaClinicMedical } from 'react-icons/fa';
import { AddAppointment } from './components/AddAppointment';
import { Search } from './components/Search';
import { AppointmentInfo } from './components/AppointmentInfo';

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('petName');
  const [orderBy, setOrderBy] = useState('asc');

  const filteredAppointments = appointmentList
    .filter((item) => {
      return (
        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())
      );
    })
    .sort((a, b) => {
      let order = orderBy === 'asc' ? 1 : -1;
      return a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order;
    });

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => setAppointmentList(data));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3 text-center">
        <FaClinicMedical className="inline-block text-green-400 align-top" /> Patient Appointment
        Schedule
      </h1>
      <AddAppointment
        onSendAppointment={(myAppointment) =>
          setAppointmentList([...appointmentList, myAppointment])
        }
        lastId={appointmentList.reduce(
          (max, item) => (Number(item.id) > max ? Number(item.id) : max),
          0,
        )}
      />
      <Search
        query={query}
        onQueryChange={(myQuery) => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={(mySort) => setOrderBy(mySort)}
        sortBy={sortBy}
        onSortByChange={(mySort) => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map((appointment) => (
          <AppointmentInfo
            appointment={appointment}
            key={appointment.id}
            onDeleteAppointment={(appointmentId) =>
              setAppointmentList(
                appointmentList.filter((appointment) => appointment.id !== appointmentId),
              )
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
