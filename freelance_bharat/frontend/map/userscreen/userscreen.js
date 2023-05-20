import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Geocoder from 'react-native-geocoding';

const UsersScreen = ({ route }) => {
  const { latitude, longitude } = route.params;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsersWithinRadius(latitude, longitude);
  }, [latitude, longitude]);

  const getUsersWithinRadius = (latitude, longitude) => {
    // Use your backend API to fetch the registered users within the 10km radius
    // You can use latitude and longitude to perform the query
    // Once you retrieve the users, update the 'users' state variable
    // with the fetched data
    // Example:
    const registeredUsers = [
      { name: 'User 1', latitude: 123.45, longitude: 67.89 },
      { name: 'User 2', latitude: 111.22, longitude: 33.44 },
      // Add more user data as needed
    ];
    setUsers(registeredUsers);
  };

  return (
    <View>
      <Text>Registered Users within 10km Radius:</Text>
      {users.map((user, index) => (
        <Text key={index}>{user.name}</Text>
      ))}
    </View>
  );
};


export default UsersScreen;