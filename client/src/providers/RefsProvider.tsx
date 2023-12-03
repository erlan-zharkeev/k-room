import React, { createContext, useRef, ReactNode } from 'react'

export const RefsContext = createContext<{ [key: string]: React.MutableRefObject<any> }>({})

interface RefsProviderProps {
  children: ReactNode
}

export const RefsProvider: React.FC<RefsProviderProps> = ({ children }) => {
  const interlocutorVideoDom = useRef<HTMLVideoElement>(null)
  const selfVideoDom = useRef<HTMLVideoElement>(null)

  const refs = { interlocutorVideoDom, selfVideoDom }

  return <RefsContext.Provider value={refs}>{children}</RefsContext.Provider>
}
