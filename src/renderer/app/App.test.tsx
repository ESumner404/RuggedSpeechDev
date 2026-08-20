import { render } from 'preact';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders hello', () => {
    const container = document.createElement('div');
    render(<App />, container);
    expect(container.textContent).toBe('hello');
  });
});
