import axios from "axios";
import fileDownload from "js-file-download";
import API from "../utils/const";
import { format } from "date-fns";
import moment from 'moment-timezone';
// const dia = format(new Date(), "dd-MM-yyyy_HH-mm");
const dia = new Date();
const formattedDate = moment(dia).tz('America/Argentina/Buenos_Aires').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

// login
const loginService = async ({ nombre, password }) => {
  const data = {
    username: nombre,
    password: password,
  };
  try {
    const response = await axios.post(`${API.URI}/api/v1/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// login

// Personal
const addEmployee = async (empleado) => {
  try {
    const response = await axios.post(`${API.URI}/api/v1/users`, empleado);
    return response;
  } catch (error) {
    throw new Error('Error al añadir empleado');
  }
};
  
const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.put(`${API.URI}/api/v1/users/${id}`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error("Error al actualizar el empleado");
  }
};

// Obtener todos los empleados
const getEmployees = async () => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/users`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw new Error('Error al obtener los empleados');
  }
};

// Verificar si el nombre de usuario es único
const checkUsernameUnique = async (username) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/users/check-username?username=${username}`);
    return response.data.isUnique; // Se espera que el backend devuelva un objeto con una propiedad `isUnique`
  } catch (error) {
    throw new Error('Error al verificar el nombre de usuario');
  }
};
//Personal

// Pacientes
const addPatient = async (patient) => {
  console.log(patient)
  try {
    const response = await axios.post(`${API.URI}/api/v1/patients`, patient);
    return response;
  } catch (error) {
    throw new Error('Error al registrar el paciente');
  }
};

const checkDniUnique = async (dni) => {
 try {
   const response = await axios.get(`${API.URI}/api/v1/patients/dni/${dni}`, {
     params: { dni }
   });
   console.log(response.data.isUnique)
   if (response.status===200){
    return false
   }else if(response.status===204){
  return true
   }
 } catch (error) {
   console.error('Error al verificar el DNI:', error);
   throw error;
 }
};

const getPatients = async () => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/patients`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    throw new Error('Error al obtener los pacientes');
  }
};

const getPatientByDni = async (dni) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/patients/dni/${dni}`, {
      params: { dni }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    throw new Error('Error al obtener paciente');
  }
};

const updatePatient = async (id, patientData) => {
  try {
    const response = await axios.put(`${API.URI}/api/v1/patients/${id}`, patientData);
    return response.data;
  } catch (error) {
    throw new Error("Error al actualizar el paciente");
  }
};

const deletePatient = async (id) => {
  try {
    const response = await axios.put(`${API.URI}/api/v1/patients/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Error al eliminar el paciente");
  }
};
// Pacientes

//Vacunaciones
const addVaccination = async (patientId, medicamento) => {
  try {
    const response = await axios.post(`${API.URI}/api/v1/vaccination`, {
      patient_id: patientId,
      medication_applied: medicamento
    });
    return response.data;
  } catch (error) {
    console.error("Error al agregar vacunación:", error);
    throw error;
  }
};

const getVaccinationsByPatientId = async (patientId) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/vaccination/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener vacunaciones:", error);
    throw error;
  }
};
const getVaccinations = async () => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/vaccination`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las vacunaciones:", error);
    throw error;
  }
};
//Vacunaciones

//Recetas
const addPrescription = async (prescriptionData) => {
  const formData = new FormData();
  formData.append('patientId', prescriptionData.patientId);
  formData.append('medication', JSON.stringify(prescriptionData.medications));
  formData.append('issueDate', prescriptionData.issueDate);

  if (prescriptionData.fotoReceta) {
    formData.append('fotoReceta', prescriptionData.fotoReceta);
  }

  try {
    const response = await axios.post(`${API.URI}/api/v1/prescriptions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding prescription:', error);
    throw error;
  }
};

// Método para obtener las recetas de un paciente por su ID
 const fetchPatientPrescriptions = async (patientId) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/prescriptions/${patientId}`);
    return response.data; // Asegúrate de que la respuesta contiene la lista de recetas
  } catch (error) {
    console.error("Error al obtener las recetas del paciente:", error);
    throw error; // Lanza el error para que el componente pueda manejarlo si es necesario
  }
};

//Método para obtener las recetas a vencer
 const getUpcommingExpirationPrescriptions = async () =>{
  try {
    const response = await axios.get(`${API.URI}/api/v1/prescriptions/upcoming-expirations`);
    console.log(response.data);
    return response.data; // Asegúrate de que la respuesta contiene la lista de recetas a vencer
  } catch (error) {
    console.error("Error al obtener las recetas a vencer:", error);
    throw error; // Lanza el error para que el componente pueda manejarlo si es necesario
  }
}
//Método para marcar norificaciones enviadas
const updateNotificationStatus = async ( prescriptionId,withdrawalNumber, notified ) => {
  try {
    // Realiza una solicitud PUT al servidor para actualizar la información de retiros
    const response = await axios.put(`${API.URI}/api/v1/prescriptions/`, {
      prescriptionId,
      withdrawalNumber,
      notified
    });

    return response.data;
  } catch (error) {
    console.error('Error al marcar la notificación como enviada:', error);
    throw error;
  }
};

const elegiblePrescriptions = async (patientId) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/prescriptions/elegible-prescriptions/${patientId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener recetas elegibles:", error);
    throw error;
  }
};

const markWithdrawal = async (prescriptionId, withdrawalNumber) => {
  try {
    const response = await axios.put(`${API.URI}/api/v1/prescriptions/mark-withdrawal`, {
      prescriptionId,
      withdrawalNumber
    });
    return response.data;
  } catch (error) {
    console.error('Error al marcar retiro:', error);
    throw error;
  }
}

const registerWithdrawal = async (patientId,prescriptionId,medications,withdrawalNumber) => {
  try {
    const response = await axios.post(`${API.URI}/api/v1/prescriptions/withdrawal`, {patientId,prescriptionId,medications,withdrawalNumber});
    return response.data;
  } catch (error) {
    console.error('Error al registrar el retiro:', error);
    throw error;
  }
};

const getWithdrawalsById = async (patientId) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/prescriptions/withdrawal/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los empleados:', error);
    throw new Error('Error al obtener los empleados');
  }
};

//Recetas

export {
  loginService,
  addEmployee,
  updateEmployee,
  getEmployees,
  getPatients,
  getPatientByDni,
  updatePatient,
  deletePatient,
  checkUsernameUnique,
  checkDniUnique,
  addPatient,
  addVaccination,
  getVaccinationsByPatientId,
  fetchPatientPrescriptions,
  addPrescription,
  getUpcommingExpirationPrescriptions,
  getVaccinations,
  updateNotificationStatus,
  elegiblePrescriptions,
  markWithdrawal,
  registerWithdrawal,
  getWithdrawalsById
};
