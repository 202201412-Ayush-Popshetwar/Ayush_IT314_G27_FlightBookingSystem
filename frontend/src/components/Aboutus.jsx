export default function AboutUs() {
    const teamMembers = [
      { name: "Raj", id: "20220101" },
      { name: "Manthan", id: "20220102" },
      { name: "Natansh", id: "20220103" },
      { name: "Ayush", id: "20220104" },
      { name: "Isha", id: "20220105" },
      { name: "Aditya", id: "20220106" },
      { name: "Harshvardhan", id: "20220107" },
      { name: "Swapnil", id: "20220108" },
    ];
  
    return (
      <div
        className="min-h-screen bg-cover bg-center p-6"
        style={{ backgroundImage: "url('flight.jpg')" }}
      >
        {/* Gray Rounded Container */}
        <div className="bg-gray-100 bg-opacity-90 rounded-lg p-8 shadow-xl max-w-7xl mx-auto">
          {/* Header Section */}
          <h1
            className="text-4xl font-extrabold text-center mb-12"
            style={{ color: "#003580", fontFamily: "'Poppins', sans-serif" }}
          >
            Meet Our Team
          </h1>
  
          {/* Team Member Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-90 rounded-lg shadow-md transform transition duration-300 hover:-translate-y-2 hover:shadow-xl p-6 flex flex-col items-center"
              >
                {/* Larger Circle Placeholder */}
                <div className="w-28 h-28 flex items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-blue-500 text-white font-bold text-3xl mb-4">
                  {member.name.charAt(0)}
                </div>
                <h2
                  className="text-lg font-semibold mt-2"
                  style={{ color: "#003580", fontFamily: "'Poppins', sans-serif" }}
                >
                  {member.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{member.id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  