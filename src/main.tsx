import React from 'react'
import ReactDOM from 'react-dom/client'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import WalletContextProvider from './context/wallet'
import './index.css'
import Balance from './pages/balance'
import Create from './pages/create'
import Entry from './pages/getStarted'
import Restore from './pages/restore'
import LogIn from './pages/login'
import CreatePassword from './pages/createPw'

const router = createMemoryRouter([
  {
    path: '/',
    element: <Balance />,
  },
  {
    path: '/getstarted',
    element: <Entry />,
  },
  {
    path: '/login',
    element: <LogIn/>
  },
  {
    path: '/createpw',
    element: <CreatePassword/>
  },
  {
    path: '/restore',
    element: <Restore />,
  },
  {
    path: '/create',
    element: <Create />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletContextProvider>
      <div className="w-[300px] h-[600px] p-2">
        <RouterProvider router={router} />
      </div>
    </WalletContextProvider>
  </React.StrictMode>
)
