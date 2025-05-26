import UserForms from '@/components/admin/forms/UserForms'
import React from 'react'

const Page = () => {
  return (
    <div className="flex justify-end items-center min-h-screen main-container">
      <div className="w-full max-w-md content-container">
        <div className="form-container">
          <h1 className="text-2xl font-bold mb-6 form-title">Create User Account</h1>
          <UserForms />
        </div>
      </div>
    </div>
  )
}

export default Page
