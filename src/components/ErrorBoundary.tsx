import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '1.5rem', fontFamily: 'sans-serif', color: '#f2ede6', background: '#121a24', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Something went wrong</h1>
          <p style={{ fontSize: '0.9rem', color: '#9eb0c8' }}>{this.state.error.message}</p>
          <button
            type="button"
            style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
