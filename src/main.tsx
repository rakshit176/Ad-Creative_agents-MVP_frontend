import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import Store from './app/store.ts'
import { axiosInterceptor } from './services/axiosInterceptor.ts'
import AppContextProvider from "./components/Sam/hooks/context.tsx";

axiosInterceptor(Store.dispatch)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextProvider>
      <Provider store={Store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AppContextProvider>
  </React.StrictMode>,
)