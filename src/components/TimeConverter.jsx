import React from 'react';

const TimeConverter = ({ time24 }) => {
  // Function to convert 24-hour time to 12-hour time
  const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 or 12 to 12
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return <span>{convertTo12Hour(time24)}</span>;
};

export default TimeConverter;