import { createContext, useContext, useState } from 'react'

const SubsContext = createContext<any[]>([]);
const SubsUpdateContext = createContext<any>('');

export function useSubs() {
  return useContext(SubsContext)
}

export function useUpdateSubs() {
  return useContext(SubsUpdateContext)
}

function SubsProvider({ children }: { children: React.ReactNode }) {
  const [subs, setSubs] = useState<any[]>([])

  function handleSubs(subs: string[]) {
    setSubs(subs)
  }

  return (
    <SubsContext.Provider value={subs}>
      <SubsUpdateContext.Provider value={handleSubs}>
        {children}
      </SubsUpdateContext.Provider>
    </SubsContext.Provider>
  )
}

export default SubsProvider
