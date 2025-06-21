import React from 'react';

const SignUp = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-8'>Sign Up</h1>
      <form className='w-full max-w-md flex flex-col gap-5'>
        <input
          type='text'
          placeholder='Username'
          className='w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition'
          id='username'
        />
        <input
          type='email'
          placeholder='Email'
          className='w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition'
          id='email'
        />
        <input
          type='password'
          placeholder='Password'
          className='w-full bg-slate-100 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition'
          id='password'
        />
        <button
          className='w-full bg-blue-500 text-white py-3 rounded-lg uppercase font-semibold hover:opacity-65 transition duration-300'
        >
          Sign Up
        </button>
      </form>
      <div className='flex gap-2 mt-6 text-gray-600'>
        <p>Have an account?</p>
        <span className='text-blue-600 hover:underline cursor-pointer'>Sign In</span>
      </div>
    </div>
  );
};

export default SignUp;
