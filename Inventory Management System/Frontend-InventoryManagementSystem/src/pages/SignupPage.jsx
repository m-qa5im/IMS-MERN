// File: src/pages/register_page.jsx
import React from 'react';
import SignupForm from '../components/signup-form/SignupForm.jsx';

const SignupPage = () => {
  return (
    <div className="bg-light d-flex justify-content-center align-items-center min-vh-100 px-3">
      <SignupForm />
    </div>
  );
};

export default SignupPage;
