import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up using your social media accounts and customize your profile.',
      icon: 'fas fa-user-plus'
    },
    {
      number: '02',
      title: 'Share Your Skills',
      description: 'Upload photos or videos showcasing your skills and talents.',
      icon: 'fas fa-share-square'
    },
    {
      number: '03',
      title: 'Connect With Others',
      description: 'Follow other users and engage with their content through likes and comments.',
      icon: 'fas fa-users'
    },
    {
      number: '04',
      title: 'Track Your Progress',
      description: 'Update your learning journey and see how far you\'ve come.',
      icon: 'fas fa-chart-line'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-blue-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">Get started in just a few simple steps</p>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-indigo-100 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={index}
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mb-6 text-xl font-bold text-white bg-indigo-600 rounded-full shadow-lg">
                  {step.number}
                </div>
                <div className="w-full p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full">
                    <i className={`${step.icon} text-indigo-600`}></i>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div 
          data-aos="fade-up"
          className="p-8 mt-20 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl"
        >
          <h3 className="mb-6 text-2xl font-semibold text-gray-800">Ready to start your journey?</h3>
          <button className="px-8 py-3 font-medium text-white transition-all duration-300 transform rounded-lg shadow-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-105">
            Join Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;