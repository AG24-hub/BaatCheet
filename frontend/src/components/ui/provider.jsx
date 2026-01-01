/*'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}*/

'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function Provider({ children }) {
  return (
    <ChakraProvider
      value={{
        ...defaultSystem,
        theme: {
          ...defaultSystem.theme,
          styles: {
            global: {
              body: {
                color: 'black',
                bg: 'white',
              },
            },
          },
        },
      }}
    >
      {children}
    </ChakraProvider>
  )
}

