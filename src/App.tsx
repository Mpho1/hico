import React, { useEffect, useState } from 'react';
import { fetchEmployees, saveEmployee, Employee } from './api';
import './App.css';

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hoveredEmployee, setHoveredEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const data = await fetchEmployees();
    setEmployees(data);
  }


  async function handleSaveEmployee(newEmployee: Employee) {
    const savedEmployee = await saveEmployee(newEmployee);
    if (savedEmployee) {
      setEmployees(prevEmployees => [...prevEmployees, savedEmployee]);
    }
  }


  function handleRowClick(employee: Employee) {
    setSelectedEmployee(employee);
    setShowForm(true);

    // Populate form fields with selected employee data
    const form = document.getElementById("employeeForm") as HTMLFormElement;
    if (form) {
      form.firstName.value = employee.firstName;
      form.lastName.value = employee.lastName;
      form.salutation.value = employee.salutation;
      form.fullName.value = employee.fullName;
      form.gender.value = employee.gender;
      form.grossSalary.value = employee.grossSalary;


      if (employee.profileColor) {
        const profileColorCheckboxes = form.querySelectorAll('input[name="profileColor"]') as NodeListOf<HTMLInputElement>;
        const selectedColors = employee.profileColor.split(',');
        profileColorCheckboxes.forEach(checkbox => {
          checkbox.checked = selectedColors.includes(checkbox.value);
        });
      }
    }
  }

  function handleRowHover(employee: Employee | null) {
    setHoveredEmployee(employee);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const updatedEmployee: Employee = {
      id: selectedEmployee ? selectedEmployee.id! : undefined,
      firstName: (event.target as any).firstName.value,
      lastName: (event.target as any).lastName.value,
      salutation: (event.target as any).salutation.value,
      fullName: (event.target as any).fullName.value,
      gender: (event.target as any).gender.value,
      profileColor: [...(event.target as any).profileColor].filter((checkbox: any) => checkbox.checked).map((checkbox: any) => checkbox.value).join(','),
      grossSalary: (event.target as any).grossSalary.value,
    };

    handleSaveEmployee(updatedEmployee).then(() => {

      if (event.currentTarget) {
        event.currentTarget.reset();
      }
      setShowForm(false);

    });
  }


  function handleKeyPress(event: { key: string; preventDefault: () => void; }) {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      setSelectedColor(event.target.value);
    }
  }

  function formatSalary(salary: string) {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function handleSalaryKeyDown(event: { key: string; preventDefault: () => void; }) {
    if (!(event.key === 'Backspace' || event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Delete' || /[0-9]/.test(event.key))) {
      event.preventDefault();
    }
  }

  function handleSalaryChange(event: { target: { value: string; }; }) {
    const formattedValue = event.target.value.replace(/\D/g, '');
    event.target.value = formatSalary(formattedValue);
  }

  function generateFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
  }

  // Function to handle changes in First Name input field
  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const firstName = event.target.value;
    const lastNameInput = document.getElementsByName("lastName")[0] as HTMLInputElement;
    const lastName = lastNameInput.value;
    const fullNameInput = document.getElementsByName("fullName")[0] as HTMLInputElement;
    fullNameInput.value = generateFullName(firstName, lastName);
  }

  // Function to handle changes in Last Name input field
  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    const lastName = event.target.value;
    const firstNameInput = document.getElementsByName("firstName")[0] as HTMLInputElement;
    const firstName = firstNameInput.value;
    const fullNameInput = document.getElementsByName("fullName")[0] as HTMLInputElement;
    fullNameInput.value = generateFullName(firstName, lastName);
  }

  function handleCancel() {
    // Reset form fields to initial values
    const form = document.getElementById("employeeForm") as HTMLFormElement;
    if (form) {
      form.reset();
    }
    // Hide the form
    setShowForm(false);
  }



  return (
    <div className="">
      {/* Table displaying employees */}
      <div className="centered-container">
        <h2>Current Employees</h2>
        <button className="add-employee-button" onClick={() => setShowForm(true)}>Add Employee</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Salutation</th>
              <th>Profile Colour</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr
                key={employee.id}
                onClick={() => handleRowClick(employee)}
                onMouseEnter={() => handleRowHover(employee)}
                onMouseLeave={() => handleRowHover(null)}
                style={{
                  backgroundColor:
                    hoveredEmployee === employee || selectedEmployee === employee
                      ? '#f0f0f0'
                      : 'transparent',
                }}
              >
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.salutation}</td>
                <td>{employee.profileColor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />

      {/* Form to display employee information */}
      {showForm && (
        // <form className="styled-form" onSubmit={handleSubmit}>
        <div className="centered-container">
          <h2>Employee Information</h2>
          <form id="employeeForm" className="styled-form" onSubmit={handleSubmit}>
            <div className="row">


              {/* Right Column */}
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">First Name:</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      defaultValue={selectedEmployee ? selectedEmployee.firstName : ''}
                      onKeyPress={handleKeyPress}
                      onChange={handleFirstNameChange}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Last Name:</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      defaultValue={selectedEmployee ? selectedEmployee.lastName : ''}
                      onKeyPress={handleKeyPress}
                      onChange={handleLastNameChange}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Salutation:</label>
                  <div className="col-sm-8">
                    <select className="form-control" name="salutation" defaultValue={selectedEmployee ? selectedEmployee.salutation : ''}>
                      <option value="Dr.">Dr.</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Mx.">Mx.</option>
                    </select>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Gender:</label>
                  <div className="col-sm-8">
                    <div>
                      <label className="mr-3">
                        <input type="radio" name="gender" value="Male" defaultChecked={selectedEmployee ? selectedEmployee.gender === 'Male' : false} />
                        Male
                      </label>
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          defaultChecked={selectedEmployee ? selectedEmployee.gender === 'Female' : false}
                        />
                        Female
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="Unspecified"
                          defaultChecked={selectedEmployee ? selectedEmployee.gender === 'Unspecified' : false}
                        />
                        Unspecified
                      </label>
                    </div>
                  </div>
                </div>
                {/* <div className="form-group row">
                <label className="col-sm-4 col-form-label">Employee ID:</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    name="employeeID"
                    defaultValue={selectedEmployee ? selectedEmployee.employeeID : ''}
                  />
                </div>
              </div> */}
              </div>

              {/* Left Column */}
              <div className="col-md-6">
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Full Name:</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      // defaultValue={selectedEmployee ? selectedEmployee.fullName : ''}
                      defaultValue={generateFullName(selectedEmployee?.firstName || '', selectedEmployee?.lastName || '')}
                      disabled

                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Gross Salary:</label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      name="grossSalary"
                      defaultValue={selectedEmployee ? selectedEmployee.grossSalary : ''}
                      onKeyDown={handleSalaryKeyDown}
                      onChange={handleSalaryChange}
                    />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-sm-4 col-form-label">Employee Profile Colour:</label>
                  <div className="col-sm-8">
                    <div>
                      <label className="mr-3">
                        <input
                          type="checkbox"
                          name="profileColor"
                          value="Green"
                          defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Green') : false) : false}
                          onChange={handleColorChange}
                        />
                        Green
                      </label>
                      <label className="mr-3">
                        <input
                          type="checkbox"
                          name="profileColor"
                          value="Blue"
                          defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Blue') : false) : false}
                          onChange={handleColorChange}
                        />
                        Blue
                      </label>
                      <label className="mr-3">
                        <input
                          type="checkbox"
                          name="profileColor"
                          value="Red"
                          defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Red') : false) : false}
                          onChange={handleColorChange}
                        />
                        Red
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="profileColor"
                          value="Default"
                          defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Default') : false) : false}
                          onChange={handleColorChange}
                        />
                        Default
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`btn ${selectedColor ? `btn-${selectedColor.toLowerCase()}` : 'btn-primary'}`}
            >
              Save
            </button>
            <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>

      )}
    </div>
  );
}

export default App;
