import React, { createContext, useRef, ReactNode } from 'react'
import useCall from 'src/hooks/useCall'
import useFirebase from '../hooks/useFirebase'

const AdditionalServiceContext = createContext<{ [key: string]: React.MutableRefObject<any> }>({})

interface ServiceProviderProps {
  children: ReactNode
}

const AdditionalServiceProvider: React.FC<ServiceProviderProps> = ({ children }) => {
  const call = useRef(useCall())
  const firebase = useRef(useFirebase())
  const services = { call, firebase }

  return <AdditionalServiceContext.Provider value={services}>{children}</AdditionalServiceContext.Provider>
}

export { AdditionalServiceProvider, AdditionalServiceContext }
