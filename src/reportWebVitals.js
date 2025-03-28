/*
    Author: Bhuwan Shrestha, Shubh Soni, Dev Patel, Alen varghese
    Description: This is the report web vitals file for the application.
    Project Name: Expense Tracker
    date: 2025-March 28

*/
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
