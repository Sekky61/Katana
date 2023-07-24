import { createContext, useReducer, useContext } from 'react';
import { create_initial_client, reducer } from './ClientReducer';

export const ClientContext = createContext([] as any[]);

export const ClientProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, create_initial_client())

  return (
    <ClientContext.Provider value={[state, dispatch]}>
      {children}
    </ClientContext.Provider>
  )
}

export function useClient() {
  const [client, dispatch] = useContext(ClientContext);

  const toggle = () => dispatch({ type: 'toggle_button' });

  const setOpenCallback = (callback: any) => dispatch({ type: 'set_open_callback', payload: callback });

  return { client, toggle, setOpenCallback };
}
