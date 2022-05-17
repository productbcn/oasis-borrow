import { SupportedUIChangeType } from 'components/AppContext'
import { useAppContext } from 'components/AppContextProvider'
import { useEffect, useState } from 'react'

export function useUIChanges<T extends SupportedUIChangeType>(topic: string): T[] {
  const { uiChanges } = useAppContext()

  const [lastUIState, lastUIStateSetter] = useState(uiChanges.lastPayload<T>(topic))

  useEffect(() => {
    const uiChanges$ = uiChanges.subscribe<T>(topic)

    const subscription = uiChanges$.subscribe((value) => {
      lastUIStateSetter(value)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return [lastUIState]
}

export function useUIChangesHandler<T extends SupportedUIChangeType>(topic: string, handler : (val:T)=>void) : void {
  const { uiChanges } = useAppContext()

  useEffect(() => {
    const uiChanges$ = uiChanges.subscribe<T>(topic)

    const subscription = uiChanges$.subscribe((value) => {
      handler(value);
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}

