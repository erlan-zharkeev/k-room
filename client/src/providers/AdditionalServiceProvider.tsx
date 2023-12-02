import { createContext, ReactNode, useRef } from 'react'
import { useCall, useFirebase } from 'src/hooks'

const AdditionalServiceContext = createContext<{ [key: string]: React.MutableRefObject<any> }>({})

interface ServiceProviderProps {
  children: ReactNode
}

const AdditionalServiceProvider: React.FC<ServiceProviderProps> = ({ children }: ServiceProviderProps) => {
  const call = useRef(useCall())
  const firebase = useRef(useFirebase())
  const services = { call, firebase }

  return <AdditionalServiceContext.Provider value={services}>{children}</AdditionalServiceContext.Provider>
}

export { AdditionalServiceProvider, AdditionalServiceContext }
