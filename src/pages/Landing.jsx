import React from 'react';
import landing from '../assets/landing.png'
import logo from '../assets/logo.svg'
import { motion } from 'motion/react';
import { Link } from 'react-router-dom'
import { GradientCard } from '../components/GradientCard';
import { DarkHeader } from '../components/DarkHeader'
import { SectionHeading } from '../components/SectionHeading';
import { BarChart3, Users, FileText, PieChart, Mail, Calendar, FileIcon, Folder, MessageSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    name: 'Lead Information',
    description: 'Collect and organize detailed information about your leads efficiently.',
    icon: Users,
  },
  {
    name: 'Add to Your Site',
    description: 'Embed with html, react and other frameworks in the near future.',
    icon: BarChart3,
  },
  {
    name: 'Api Endpoint or Netlify Forms',
    description: 'Adjust where your forms get sent.',
    icon: PieChart,
  },
  {
    name: 'Builder dashboard',
    description: 'Access all of your forms in one easy place.',
    icon: FileText,
  },
  {
    name: 'Customized Styling',
    description: 'Streamline the design of your form with our easy to use UI.',
    icon: Calendar,
  },
  {
    name: 'Preview Forms',
    description: 'Preview your forms before you embed them.',
    icon: Mail,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <DarkHeader />
      

      <main>
        {/* Hero Section */}
        <section className="relative pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
              >
                A Form Building Dashboard for Developers
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6 text-lg leading-8 text-gray-400"
              >
                Build and manage forms easily with our no-code solution. Create embeddable forms,
                qualify leads, and integrate with your favorite tools.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-10 flex items-center justify-center gap-4"
              >
                <Link 
                    to="/dashboard" 
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                    >
                    Get Started
                </Link>
                
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <GradientCard>
                <img
                  src={landing}
                  alt="Form Builder Dashboard"
                  className="w-full rounded-lg"
                />
              </GradientCard>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <SectionHeading
              title="Powerful features to help you manage all your leads"
              subtitle="Everything you need to collect, organize, and analyze your leads efficiently."
            />

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GradientCard className="h-full">
                    <feature.icon className="h-8 w-8 text-purple-500" />
                    <h3 className="mt-4 text-xl font-semibold text-white">{feature.name}</h3>
                    <p className="mt-2 text-gray-400">{feature.description}</p>
                  </GradientCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

       
        {/* CTA Section */}
        <section className="mt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <GradientCard className="relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Join the community</h2>
                <p className="mt-4 mb-5 text-lg text-gray-400">
                  Connect with other developers and share your experience building forms and managing leads.
                </p>
                
                <Link 
                    to="/dashboard" 
                    className="mt-8 rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
                    >
                    Get Started Now
                </Link>
              </div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20" />
            </GradientCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 border-t border-gray-800 bg-gray-950 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-8 ">
              <div>
                <div className="flex items-center gap-2">
                  {/* <div className="h-8 w-8 rounded-lg bg-purple-600" /> */}
                  <img src={logo} className='h-8 w-8' alt="logo" />
                  <span className="text-xl font-bold text-white">WizardFormz</span>
                </div>
                <p className="mt-4 text-sm text-gray-400">
                  Build and manage forms easily. Create embeddable HTML forms.
                </p>
              </div>
             
            </div>
            <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-gray-800 pt-8 sm:flex-row">
              <p className="text-sm text-gray-400">© 2024 WizardFormz. All rights reserved.</p>
              <div className="flex gap-8">
               
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;


