
import  UserData  from '@/lib/user';
import React, { useEffect } from 'react';


// interface UserProfileProps {
//   user: UserData;
// }

export function UserProfile( user : UserData) {
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-6">
        <img
          src={user.user.photoUrl}
          alt={user.user.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
        />
        {/* {console.log(user.user.usn)} */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.user.name}</h2>
          <p className="text-gray-600">USN: {user.user.usn}</p>
          <p className="text-blue-600 font-semibold">{user.user.type}</p>
        </div>
      </div>
    </div>
  );
}