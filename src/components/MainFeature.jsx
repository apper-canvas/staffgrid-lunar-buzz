import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const departments = [
  'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Legal'
]

const roles = [
  'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Manager', 'Director', 
  'Marketing Specialist', 'Sales Representative', 'HR Coordinator', 'Analyst', 
  'Designer', 'Product Manager', 'DevOps Engineer', 'QA Engineer'
]

const statuses = ['Active', 'Inactive', 'On Leave', 'Terminated']

function MainFeature() {
  const [employees, setEmployees] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'Active',
    phone: '',
    salary: '',
    hireDate: ''
  })

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('staffgrid-employees')
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees))
    }
  }, [])

  // Save to localStorage whenever employees change
  useEffect(() => {
    localStorage.setItem('staffgrid-employees', JSON.stringify(employees))
  }, [employees])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.role || !formData.department) {
      toast.error('Please fill in all required fields')
      return
    }

    const employeeData = {
      ...formData,
      id: editingEmployee?.id || Date.now().toString(),
      salary: parseFloat(formData.salary) || 0,
      hireDate: formData.hireDate || new Date().toISOString().split('T')[0],
      createdAt: editingEmployee?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? employeeData : emp))
      toast.success('Employee updated successfully!')
    } else {
      setEmployees([...employees, employeeData])
      toast.success('Employee added successfully!')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'Active',
      phone: '',
      salary: '',
      hireDate: ''
    })
    setIsFormOpen(false)
    setEditingEmployee(null)
  }

  const handleEdit = (employee) => {
    setFormData(employee)
    setEditingEmployee(employee)
    setIsFormOpen(true)
  }

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id))
    setDeleteConfirm(null)
    toast.success('Employee removed successfully!')
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment
    const matchesStatus = !filterStatus || employee.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200'
      case 'Inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'On Leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Terminated': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-8">
      {/* Controls Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search and Filters */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Add Employee Button */}
          <motion.button
            onClick={() => setIsFormOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold shadow-card hover:shadow-soft transition-all duration-200"
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span>Add Employee</span>
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <div className="text-2xl font-bold text-primary">{employees.length}</div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Total Employees</div>
          </div>
          <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === 'Active').length}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Active</div>
          </div>
          <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter(emp => emp.status === 'On Leave').length}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">On Leave</div>
          </div>
          <div className="text-center p-4 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <div className="text-2xl font-bold text-surface-600">
              {new Set(employees.map(emp => emp.department)).size}
            </div>
            <div className="text-sm text-surface-600 dark:text-surface-400">Departments</div>
          </div>
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
      >
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
            Employee Directory ({filteredEmployees.length})
          </h3>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <ApperIcon name="Users" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-surface-900 dark:text-surface-100 mb-2">
              {employees.length === 0 ? 'No employees yet' : 'No employees found'}
            </h4>
            <p className="text-surface-600 dark:text-surface-400">
              {employees.length === 0 
                ? 'Add your first employee to get started'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 dark:bg-surface-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                <AnimatePresence>
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
                              {employee.name}
                            </div>
                            <div className="text-sm text-surface-500 dark:text-surface-400">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-surface-900 dark:text-surface-100">{employee.role}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">{employee.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-surface-900 dark:text-surface-100">
                        {employee.hireDate ? format(new Date(employee.hireDate), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEdit(employee)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-primary hover:bg-primary hover:text-white rounded-lg transition-all duration-200"
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => setDeleteConfirm(employee)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Employee Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-surface-100">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Role *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Select Role</option>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Department *
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Hire Date
                    </label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Annual Salary
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      className="input-field"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl shadow-card hover:shadow-soft transition-all duration-200"
                  >
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-surface-100 mb-2">
                  Delete Employee
                </h3>
                <p className="text-surface-600 dark:text-surface-400 mb-6">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <motion.button
                    onClick={() => setDeleteConfirm(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature