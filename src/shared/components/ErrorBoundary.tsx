import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';

export type ErrorBoundaryProps = {
  children: ReactNode;
  /** Custom UI instead of the default <ErrorState>. */
  fallback?: ReactNode;
};

type State = { hasError: boolean };

/** Catches render crashes below it so one broken widget doesn't blank the whole page. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return this.props.fallback ?? <ErrorState onRetry={this.reset} />;
  }
}
