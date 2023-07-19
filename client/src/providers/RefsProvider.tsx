import React, { createContext, useRef, ReactNode } from 'react'

const RefsContext = createContext<{ [key: string]: React.MutableRefObject<any> }>({})

interface RefsProviderProps {
  children: ReactNode
}

const RefsProvider: React.FC<RefsProviderProps> = ({ children }) => {
  const interlocutorVideoDom = useRef(null)
  const selfVideoDom = useRef(null)

  const refs = { interlocutorVideoDom, selfVideoDom }

  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}

export { RefsProvider, RefsContext }
