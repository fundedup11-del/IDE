import React from 'react'
import { Button } from '@shadcn/ui'

export default function ShadcnExample() {
  return (
    <main style={{ padding: 24 }}>
      <h1>shadcn/ui Example</h1>
      <p>This demonstrates a simple `Button` from `@shadcn/ui`.</p>
      <div style={{ marginTop: 12 }}>
        <Button variant="default">Primary action</Button>
      </div>
    </main>
  )
}
