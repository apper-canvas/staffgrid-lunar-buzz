import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-lg border-b border-surface-200 dark:bg-surface-900 dark:bg-opacity-80 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-card">
                <ApperIcon name="Users" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">StaffGrid</h1>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition-colors duration-200"
              >
                <ApperIcon 
                  name={isDarkMode ? "Sun" : "Moon"} 
                  className="w-5 h-5 text-surface-600 dark:text-surface-400" 
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-surface-900 dark:text-surface-100 mb-6">
            Employee Management
            <span className="block gradient-text">Made Simple</span>
          </h2>
          <p className="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed">
            Streamline your workforce management with our comprehensive employee tracking system. 
            Add, edit, view, and manage employee records with ease.
          </p>
        </motion.div>

        <MainFeature />
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 py-12 bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold gradient-text">StaffGrid</span>
            </div>
            <p className="text-surface-600 dark:text-surface-400">
              © 2024 StaffGrid. Empowering teams through better employee management.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home