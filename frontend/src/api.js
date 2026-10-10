/*
  api.js
  This is the ONLY file that sends HTTP requests to the Express backend.
  Every page imports the functions below instead of writing fetch() again.
*/

// Base address of our Express server.
// It is read from the file frontend/.env  ->  VITE_API_URL=http://localhost:5050
// (change it there if you change the backend port, so both always match)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Generic request function.
// path  = '/customers' , '/vehicles' , '/services' , '/dashboard'
// method = 'GET' , 'POST' , 'PUT' , 'DELETE'
async function request(path, method = 'GET', body = null) {
  const options = {
    method: method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body !== null) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + path, options);
  const json = await response.json();

  // If the backend sends an error (400, 404, 500...) we throw it as an Error
  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }

  return json.data;
}

/* ----------------------------- DASHBOARD ----------------------------- */
export const getDashboard = () => request('/dashboard');

/* ----------------------------- CUSTOMERS ----------------------------- */
export const getCustomers = (search = '') =>
  request('/customers?search=' + encodeURIComponent(search));

export const addCustomer = (customer) => request('/customers', 'POST', customer);

export const updateCustomer = (id, customer) =>
  request('/customers/' + id, 'PUT', customer);

export const deleteCustomer = (id) => request('/customers/' + id, 'DELETE');

/* ----------------------------- VEHICLES ------------------------------ */
export const getVehicles = (search = '') =>
  request('/vehicles?search=' + encodeURIComponent(search));

export const addVehicle = (vehicle) => request('/vehicles', 'POST', vehicle);

export const updateVehicle = (id, vehicle) =>
  request('/vehicles/' + id, 'PUT', vehicle);

export const deleteVehicle = (id) => request('/vehicles/' + id, 'DELETE');

/* ----------------------------- SERVICES ------------------------------ */
export const getServices = (search = '', status = '') => {
  let url = '/services?search=' + encodeURIComponent(search);
  if (status !== '') {
    url += '&status=' + encodeURIComponent(status);
  }
  return request(url);
};

export const addService = (service) => request('/services', 'POST', service);

export const updateService = (id, service) =>
  request('/services/' + id, 'PUT', service);

export const deleteService = (id) => request('/services/' + id, 'DELETE');