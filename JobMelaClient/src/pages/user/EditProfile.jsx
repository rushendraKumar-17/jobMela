import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Save, X } from 'lucide-react';
import axios from 'axios';

const EditProfile = () => {
  const { user, updateUser ,apiurl} = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    languages: user?.languages?.join(', ') || '',
    phone: user?.phone || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    skills: user?.skills?.join(', ') || '',
    degrees: user?.degrees?.join(', ') || '',
    address: user?.address || '',
    yearOfGraduation: user?.yearOfGraduation || '',
    gender: user?.gender || 'any',
    CVUrl: user?.CVUrl || ''
  });
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
      e.preventDefault();
      console.log("Submitting form data:", formData);
      if(!user){
        console.log("User not found");
        return;
      }
    try {
        const formDataToSend = {
          ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
            degrees: formData.degrees.split(',').map(d => d.trim()).filter(Boolean),
            languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean)
        };
        const response =await axios.put(`${apiurl}/user/edit/${user.id}`,formDataToSend,{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`}});
        // console.log(response)
        // const updatedUser = {
        //   ...formData,
        //   skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        //   degrees: formData.degrees.split(',').map(d => d.trim()).filter(Boolean)
        // };
        // console.log(updatedUser)
        updateUser(response.data);
        navigate('/profile');
    } catch (error) {
      console.log("Error updating profile:", error);
      // Handle error (e.g., show an alert)

        
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Fields */}
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
              <input
                type="text"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({...formData, yearsOfExperience: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Degrees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degrees (comma separated)</label>
              <input
                type="text"
                name="degrees"
                value={formData.degrees}
                onChange={(e) => setFormData({...formData, degrees: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Languages (comma separated)</label>
              <input
                type="text"
                name="languagesKnown"
                value={formData.languages}
                onChange={(e) => setFormData({...formData, languages: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year of Graduation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year of Graduation</label>
              <input
                type="text"
                name="yearOfGraduation"
                value={formData.yearOfGraduation}
                onChange={(e) => setFormData({...formData, yearOfGraduation: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="any">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* CV URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CV URL</label>
              <input
                type="text"
                name="CVUrl"
                value={formData.CVUrl}
                onChange={(e) => setFormData({...formData, CVUrl: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div> 
            

            {/* Form Actions */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
