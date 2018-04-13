import React from 'react';
import moment from 'moment';

const BookingTable = (props) => {
  if (!props.events) return <div>No events for your center yet.</div>;
  return (
    <table className="bordered responsive-table">
      <thead>
        <tr>
          <th>Event Title</th>
          <th>Date</th>
          <th>Venue</th>
          <th>State</th>
          <th>Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.events.map((event) => {
          const duration = moment(event.enddate).diff(moment(event.startdate), 'days') + 1;
          return (
            <tr key={event.eid}>
              <td>{event.title}</td>
              <td>{moment(event.startdate).format('DD-MM-YYYY')}</td>
              <td>{event.name}</td>
              <td>{event.state}</td>
              <td>
                {duration} {duration > 1 ? 'days' : 'day'}
              </td>
              <td>{event.concluded ? 'Concluded' : 'Active'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BookingTable;