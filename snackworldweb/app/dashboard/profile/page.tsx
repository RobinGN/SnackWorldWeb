"use client"

import { useState } from "react"

const ProfilePage = () => {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [isEditing, setIsEditing] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = () => {
    // Implement save logic here (e.g., API call)
    setIsEditing(false)
    alert("Profile updated!")
  }

  const handleCancelClick = () => {
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      // Implement password change logic here (e.g., API call)
      setPasswordMessage("Password changed successfully!")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setPasswordMessage(""), 3000) // Clear message after 3 seconds
    } else {
      setPasswordMessage("Passwords do not match.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name:
        </label>
        {isEditing ? (
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p>{name}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <p>{email}</p>
      </div>

      {isEditing ? (
        <div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            type="button"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleEditClick}
        >
          Edit Profile
        </button>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="newPassword"
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={handleChangePassword}
        >
          Change Password
        </button>
        {passwordMessage && <p className="mt-2">{passwordMessage}</p>}
      </div>
    </div>
  )
}

export default ProfilePage
