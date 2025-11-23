import React from 'react';
import Layout from './components/Layout';
import Button from './components/Button';
import { generateProducts } from '@/lib/data-generator';

export default function Page() {
  const products = generateProducts(6, 'electronics');

  return (
    <Layout>
      <section aria-labelledby="example-heading">
        <h1 id="example-heading" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Design System Example</h1>

        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {products.map((p) => (
            <article key={p.id} style={{ background: 'var(--card-background)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
              <img src={p.image} alt={p.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: '6px' }} />
              <h3 style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>{p.name}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{p.description}</p>
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: '8px' }}>
                <Button variant="primary">Buy</Button>
                <Button variant="secondary">Details</Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
