import { createContext, useReducer, useContext } from 'react';
import { initialState, reducer } from './ClientReducer';

export const ClientContext = createContext([] as any[]);

export const ClientProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ClientContext.Provider value={[state, dispatch]}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const [client, dispatch] = useContext(ClientContext);

  const toggle = () => dispatch({ type: 'toggle_button' })

  return { client, toggle };
}
