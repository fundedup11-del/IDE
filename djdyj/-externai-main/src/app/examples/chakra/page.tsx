import React from 'react'
import { ChakraProvider, Button } from '@chakra-ui/react'

export default function ChakraExample() {
  return (
    <ChakraProvider>
      <main style={{ padding: 24 }}>
        <h1>Chakra UI Example</h1>
        <p>This demonstrates a simple `Button` from `@chakra-ui/react`.</p>
        <div style={{ marginTop: 12 }}>
          <Button colorScheme="teal">Primary action</Button>
        </div>
      </main>
    </ChakraProvider>
  )
}
