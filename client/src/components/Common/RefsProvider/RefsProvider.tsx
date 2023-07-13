import React, { createContext, useRef, ReactNode } from 'react'

const RefsContext = createContext<{ [key: string]: React.MutableRefObject<any> }>({})

interface RefsProviderProps {
  children: ReactNode
}

const RefsProvider: React.FC<RefsProviderProps> = ({ children }) => {
  const ref1 = useRef(null)
  const refs = { ref1 }

  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}

export { RefsProvider, RefsContext }
