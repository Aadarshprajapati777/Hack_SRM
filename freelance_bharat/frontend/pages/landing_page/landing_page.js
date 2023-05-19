import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

import Logo from './logo.png';

const Landing_Page = ({ navigation }) => {
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigation.navigate('Login_Page');
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default Landing_Page;