import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:1000'; // Replace this with your backend server URL

// Interface for employee data
export interface Employee {
  id?: number;
  firstName: string;
  lastName: string;
  salutation: string;
  profileColor?: string;
  gender: string;
  fullName: string;
  grossSalary: string;
}

// Function to fetch all employees
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response: AxiosResponse<Employee[]> = await axios.get(`${API_BASE_URL}/employees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// Function to save an employee
export async function saveEmployee(employee: Employee): Promise<Employee | null> {
  try {
    const response: AxiosResponse<Employee> = await axios.post(`${API_BASE_URL}/employees`, employee);
    return response.data;
  } catch (error) {
    console.error('Error1 saving employee:', error);
    return null;
  }
}
