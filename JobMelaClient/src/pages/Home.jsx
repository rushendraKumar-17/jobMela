import React, { useContext, useEffect, useState } from 'react';
import {
  MapPin,
  Briefcase,
  Users,
  Star,
  GraduationCap,
  ShieldCheck,
  
  Wifi,
  
  Bus,
 
} from 'lucide-react';
import AwesomeLoader from '../components/Loader';
import axios from 'axios';
import AppContext from '../contexts/AppContext';
import MapComponent from "../components/MapComponent";
const Home = () => {
  const {apiurl}=useContext(AppContext)
  const [jobMela,setJobMela]=useState(null);
  const [loading, setLoading] = useState(true);
  const jobmelaDetails = async ()=>{
    try {
      const response =await axios.get(`${apiurl}/mela/getMela/1`)
      // console.log(response.data);
      setJobMela(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job mela details:", error);
      
    }
  }

  useEffect(() => {
    jobmelaDetails();
  }, []);
  return (
    <>{loading?<AwesomeLoader />:<div className="min-h-screen bg-white">
      {/* Hero Section */}
      
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {jobMela.name}
        </h1>
        
        <div className="flex justify-center items-center gap-2 mb-6">
          <MapPin className="w-6 h-6 text-red-600" />
          <p className="text-xl text-gray-700">
            {jobMela.area}
          </p>
        </div>
        
        {/* <p className="text-2xl font-semibold text-gray-800 mb-8"> */}
          <div className='text-2xl font-semibold text-gray-800 mb-8 flex justify-center flex-wrap'>
          <div>{(new Date(jobMela.startDate)).toLocaleDateString()}</div> &nbsp;|&nbsp; <div>{(new Date(jobMela.endDate)).toLocaleDateString()}</div> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; <div>9:00 AM to 5:00 PM</div>
          </div>
        {/* </p> */}
        
        {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-transform transform hover:scale-105">
          Register Now
        </button> */}
      </div>

      {/* Key Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 px-4 bg-white max-w-6xl mx-auto">
        <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Briefcase className="w-12 h-12 mx-auto text-blue-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{jobMela.companies.length}+ Companies</h3>
          <p className="text-gray-600">Top employers including {jobMela.companies}</p>
        </div>
        
        <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Users className="w-12 h-12 mx-auto text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">1,054+ Vacancies</h3>
          <p className="text-gray-600">Across IT, healthcare, retail, and finance sectors</p>
        </div>
        
        <div className="text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Star className="w-12 h-12 mx-auto text-purple-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Entry</h3>
          <p className="text-gray-600">Open to freshers & experienced professionals</p>
        </div>
      </div>

      {/* Participating Companies */}
      <div className="py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Participating Companies
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          <img src="/axis-bank-logo.png" className="h-12 opacity-90 hover:opacity-100 transition-opacity" alt="Axis Bank" />
          <img src="/dmart-logo.png" className="h-12 opacity-90 hover:opacity-100 transition-opacity" alt="D-Mart" />
          <img src="/aurobindo-logo.png" className="h-12 opacity-90 hover:opacity-100 transition-opacity" alt="Aurobindo Pharma" />
        </div>
      </div>

      {/* Job Categories */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Job Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <GraduationCap className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Freshers & Internships</h3>
            <p className="text-gray-600">Entry-level roles for recent graduates</p>
          </div>
          
          <div className="p-6 border rounded-lg hover:shadow-md transition-shadow">
            <ShieldCheck className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold mb-2">Experienced Professionals</h3>
            <p className="text-gray-600">5+ years in IT, healthcare, or engineering</p>
          </div>
        </div>
      </div>

      {/* Venue Map & Details */}
      <div className="py-12 px-4 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Venue Details
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-w-16 aspect-h-9 mb-6 rounded-xl overflow-hidden shadow-lg z-0">
            <MapComponent latitude={jobMela.location[0]} longitude={jobMela.location[1]}/>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                Transportation
              </h3>
              <p className="text-gray-600">
                Nearest bus stop: Yerragonda Palem (200m)<br />
                Parking available for 500+ vehicles
              </p>
            </div>
            
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-600" />
                Facilities
              </h3>
              <p className="text-gray-600">
                Free Wi-Fi & charging stations<br />
                Food courts and rest areas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="py-12 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          How to Participate
        </h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-4">
            <div className="bg-indigo-600 w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Register Online</h3>
            <p className="text-gray-600">Complete your profile in 5 minutes</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-indigo-600 w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">Upload CV</h3>
            <p className="text-gray-600">Get noticed by top employers</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-indigo-600 w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">Attend Event</h3>
            <p className="text-gray-600">Bring printed resume & ID proof</p>
          </div>
        </div>
      </div>
    </div>}
      
    </>
    
  );
};

export default Home;
