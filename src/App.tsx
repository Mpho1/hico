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



  return (
    <div className="App">
      {/* Table displaying employees */}
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

      {/* Button to add new employee */}
      <button onClick={() => setShowForm(true)}>Add Employee</button>

      {/* Form to display employee information */}
      {showForm && (
        <form className="App" onSubmit={handleSubmit}>
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  defaultValue={selectedEmployee ? selectedEmployee.firstName : ''}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  defaultValue={selectedEmployee ? selectedEmployee.lastName : ''}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="form-group">
                <label>Salutation:</label>
                <select className="form-control" name="salutation" defaultValue={selectedEmployee ? selectedEmployee.salutation : ''}>
                  <option value="Dr.">Dr.</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Mx.">Mx.</option>
                </select>
              </div>
              <div className="form-group">
                <label>Gross Salary:</label>
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

            {/* Right Column */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  defaultValue={selectedEmployee ? selectedEmployee.fullName : ''}
                />
              </div>
              <div className="form-group">
                <label>Gender:</label>
                <div>
                  <label>
                    <input type="radio" name="gender" value="Male" defaultChecked={selectedEmployee ? selectedEmployee.gender === 'Male' : false} />
                    Male
                  </label>
                  <label>
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
              <div className="form-group">
                <label>Employee Profile Colour:</label>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="profileColor"
                      value="Green"
                      defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Green') : false) : false}
                      onChange={handleColorChange}
                    />
                    Green
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="profileColor"
                      value="Blue"
                      //defaultChecked={selectedEmployee ? selectedEmployee.profileColor.includes('Blue') : false}
                      defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Blue') : false) : false}
                      onChange={handleColorChange}
                    />
                    Blue
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="profileColor"
                      value="Red"
                      // defaultChecked={selectedEmployee ? selectedEmployee.profileColor.includes('Red') : false}
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
                      //defaultChecked={selectedEmployee ? selectedEmployee.profileColor.includes('Default') : false}
                      defaultChecked={selectedEmployee ? (selectedEmployee.profileColor ? selectedEmployee.profileColor.includes('Default') : false) : false}
                      onChange={handleColorChange}
                    />
                    Default
                  </label>
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

        </form>
      )}
    </div>
  );
}

export default App;
