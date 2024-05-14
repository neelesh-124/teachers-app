import React, { useEffect } from 'react';
// Import necessary modules
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// Define the type for props

// Import dynamic components
const Login = dynamic(() => import('./Login'), { ssr: false });
const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

// Define the Home component
const Home: React.FC = () => {
  // State for controlling drawer open/close

  // Function to toggle drawer state

  // Log 'hi' to console
  // console.log('hi');

  const { locale, locales, push } = useRouter();

  useEffect(() => {
    push('/Login', undefined, { locale: 'mr'});
  })

  return (
    <>
    {/* <h1>Hello</h1> */}
      {/* <Login /> */}
    </>
  );
};

export default Home;
