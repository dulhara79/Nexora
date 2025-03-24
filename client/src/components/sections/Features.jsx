import React from 'react';

const FeatureCard = ({ icon, title, description, index }) => {
  return (
    <div 
      data-aos="fade-up" 
      data-aos-delay={index * 100}
      className="p-6 transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-xl hover:-translate-y-1"
    >
      <div className="flex items-center justify-center mb-6 bg-indigo-100 rounded-full w-14 h-14">
        <i className={`${icon} text-xl text-indigo-600`}></i>
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: 'fas fa-share-alt',
      title: 'Skill Sharing',
      description: 'Upload photos or short videos with descriptions to share your skills with the community.'
    },
    {
      icon: 'fas fa-tasks',
      title: 'Learning Progress',
      description: 'Track and share your learning journey with predefined templates to showcase your growth.'
    },
    {
      icon: 'fas fa-route',
      title: 'Learning Plans',
      description: 'Create structured learning plans with topics, resources, and completion timelines.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Interactivity',
      description: 'Like and comment on posts, with full control over your content and interactions.'
    },
    {
      icon: 'fas fa-user-circle',
      title: 'User Profiles',
      description: 'Showcase your skills on your profile page and follow others to see their content.'
    },
    {
      icon: 'fas fa-bell',
      title: 'Notifications',
      description: 'Stay updated with notifications for likes and comments on your posts.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-blue-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center" data-aos="fade-up">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Key Features</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">Discover what makes our platform unique</p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;