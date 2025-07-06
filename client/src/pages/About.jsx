import React from "react";
import {
  FaHome,
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaAward,
  FaMapMarkedAlt,
  FaQuoteLeft,
} from "react-icons/fa";

const AboutUs = () => {

  const values = [
    {
      icon: FaAward,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our service, ensuring the highest quality experience for our clients.",
    },
    {
      icon: FaHandshake,
      title: "Trust",
      description:
        "Building lasting relationships through transparency, honesty, and reliable service is at the core of what we do.",
    },
    {
      icon: FaUsers,
      title: "Client-Focused",
      description:
        "Your needs and satisfaction are our top priority. We listen, understand, and deliver personalized solutions.",
    },
    {
      icon: FaMapMarkedAlt,
      title: "Local Expertise",
      description:
        "Deep knowledge of local markets and neighborhoods helps us provide valuable insights and guidance.",
    },
  ];

  const team = [
    {
      name: "Jyotkumar Vasava",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      description:
        "With over 5 years in real estate, founded our company with a vision to revolutionize property transactions.",
    },]
   
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                About
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  Our Story
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Connecting dreams with reality through exceptional real estate
                experiences since 2025.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2025, we started with a simple mission: to make real
                estate transactions transparent, efficient, and stress-free.
                What began as a small local agency has grown into a trusted
                platform serving thousands of clients across the region.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our commitment to innovation and customer satisfaction has
                driven us to embrace technology while maintaining the personal
                touch that makes real estate truly special. We believe that
                finding the perfect home or investment property should be an
                exciting journey, not a daunting task.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&w=600&h=400&fit=crop"
                alt="Modern office building"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold">New</div>
                <div className="text-sm">and Modern</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our
              clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center group p-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Founder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated professionals committed to making your real estate
              dreams come true.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
         
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-300">
              vasavajyotkumar@gmail.com
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300">
              +91 9998212821
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
