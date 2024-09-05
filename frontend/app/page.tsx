'use client'

import React, { useState, useEffect } from "react"
import UserType from "@/types/UserType"
import { useForm, SubmitHandler } from "react-hook-form";

type inputs = {
  id: number
  name: string
  username: string
  email: string
}

export default function Home() {
  const [users, setUsers] = useState<UserType[]>([]);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<inputs>();
  const [formStatus, setFormStatus] = useState<string>('');
  const [userDetail, setUserDatail] = useState<UserType | null>(null);

  // 載入使用者資料
  const loadUsers = async () => {
    const response = await fetch(process.env.API_URL + '/users', {
      method: 'GET'
    }).catch((error) => console.log(error));
    if (response?.status === 200) {
      const data = await response.json()
      // console.log(data)
      setUsers(data)
    }
  }

  // 新增使用者
  const addUserHandler = async (data: inputs) => {
    const response = await fetch(process.env.API_URL + '/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch((error) => console.log(error));
    if (response?.status === 200) {
      const newUser = await response.json()
      // console.log(newUser)
      setUsers([...users, newUser])
      document.getElementById('user-model-close-btn')?.click()
    }
  }

  // 編輯使用者
  const editUserHandler = async (data: inputs) => {
    const response = await fetch(process.env.API_URL + '/user/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).catch((error) => console.log(error));
    if (response?.status === 200) {
      const newUser = await response.json()
      // console.log(newUser)
      const newUsers = users.map(user => user.id === newUser.id ? newUser : user)
      setUsers(newUsers)
      document.getElementById('user-model-close-btn')?.click()
    }
  }

  // 刪除使用者
  const deleteUserHandler = async (id: number) => {
    const response = await fetch(process.env.API_URL + '/user/' + id, {
      method: 'DELETE'
    }).catch((error) => console.log(error));
    if (response?.status === 200) {
      const newUsers = users.filter(user => user.id !== id)
      setUsers(newUsers)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setFormStatus('add')}
        className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="user-modal"
        data-hs-overlay="#user-modal">
        Add User
      </button>

      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">id</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">name</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">username</th>
                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">email</th>
                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {users.map(user => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                        <div className="hs-dropdown relative inline-flex">
                          <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                            Actions
                            <svg className="hs-dropdown-open:rotate-180 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                          </button>

                          <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full z-10" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
                            <a 
                              onClick={() => setUserDatail(user)}
                              aria-haspopup="dialog" aria-expanded="false" aria-controls="user-detail-modal" data-hs-overlay="#user-detail-modal"
                              className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#"
                            >
                              View
                            </a>
                            <a
                              onClick={() => {
                                setFormStatus('edit')
                                setValue('id', user.id)
                                setValue('name', user.name)
                                setValue('username', user.username)
                                setValue('email', user.email)
                              }}
                              className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#"
                              aria-haspopup="dialog"
                              aria-expanded="false"
                              aria-controls="user-modal"
                              data-hs-overlay="#user-modal"
                            >
                              Edit
                            </a>
                            <a onClick={() => deleteUserHandler(user.id)} className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
                              Delete
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div id="user-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" aria-labelledby="user-modal-label">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div className="w-full flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
            <div className="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
              <h3 id="user-modal-label" className="font-bold text-gray-800 dark:text-white">
                {formStatus === 'add' ? 'Add User' : 'Edit User'}
              </h3>
              <button id="user-model-close-btn" type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#user-modal">
                <span className="sr-only">Close</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <form>
                <div className="py-6 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
                  <div className="mt-2 space-y-3">
                    <input type="text" {...register('name')} className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Name" />
                    <input type="text" {...register('username')} className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Username" />
                    <input type="email" {...register('email')} className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="Email" />
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
              <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" data-hs-overlay="#user-modal">
                關閉
              </button>
              {formStatus === 'edit' && (
                <button type="button" onClick={handleSubmit(editUserHandler)} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                  編輯
                </button>
              )}
              {formStatus === 'add' && (
                <button type="button" onClick={handleSubmit(addUserHandler)} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:bg-green-700 disabled:opacity-50 disabled:pointer-events-none">
                  新增
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="user-detail-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog" aria-labelledby="user-detail-modal-label">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm pointer-events-auto dark:bg-neutral-900 dark:border-neutral-800">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h3 id="user-detail-modal-label" className="block text-xl sm:text-2xl font-semibold text-gray-800 dark:text-neutral-200">User Detail</h3>
              </div>

              <div className="mt-8 sm:mt-10 divide-y divide-gray-200 dark:divide-neutral-700">
                <div className="flex gap-x-7 py-5 first:pt-0 last:pb-0">
                  <div className="grow">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                      ID
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {userDetail?.id}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-7 py-5 first:pt-0 last:pb-0">
                  <div className="grow">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                      Name
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {userDetail?.name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-7 py-5 first:pt-0 last:pb-0">
                  <div className="grow">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                      Username
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {userDetail?.username}
                    </p>
                  </div>
                </div>

                <div className="flex gap-x-7 py-5 first:pt-0 last:pb-0">
                  <div className="grow">
                    <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                      Email
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-500">
                      {userDetail?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end items-center gap-x-2 p-4 sm:px-7 border-t dark:border-neutral-800">
              <button 
                type="button" 
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" 
                aria-label="Close" 
                data-hs-overlay="#user-detail-modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
