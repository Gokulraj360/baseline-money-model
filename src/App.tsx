import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AppShell } from './components/AppShell';
import { useRoute, navigate } from './lib/router';
import { Icon } from './components/Icon';
import Overview from './screens/Overview';
import Inbox from './screens/Inbox';
import Transactions from './screens/Transactions';
import Rules from './screens/Rules';
import Recurring from './screens/Recurring';
import Plan from './screens/Plan';
import Simulate from './screens/Simulate';
import Review from './screens/Review';
import Coach from './screens/Coach';
import Settings from './screens/Settings';

interface BoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the console useful during the demo; the UI stays calm.
    console.error('Baseline crashed a view', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page">
          <div className="empty" style={{ paddingTop: 80 }}>
            <div className="empty-icon"><Icon name="alert" size={18} /></div>
            <h3>This view hit a snag</h3>
            <p>
              Your data is still on this device. {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 8 }}>
              <button className="btn" onClick={() => this.setState({ error: null })}>Try again</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  this.setState({ error: null });
                  navigate('/overview');
                }}
              >
                Back to overview
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFound({ path }: { path: string }) {
  return (
    <div className="page">
      <div className="empty" style={{ paddingTop: 80 }}>
        <div className="empty-icon"><Icon name="compass" size={18} /></div>
        <h3>No room called “{path}”</h3>
        <p>The address exists, the page does not. Every section is reachable from the rail or the palette.</p>
        <div className="row" style={{ gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-primary" onClick={() => navigate('/overview')}>Open the overview</button>
          <button className="btn" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
            Open search <span className="kbd">⌘K</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const SCREENS: Record<string, () => ReactNode> = {
  overview: Overview,
  inbox: Inbox,
  transactions: Transactions,
  rules: Rules,
  recurring: Recurring,
  plan: Plan,
  simulate: Simulate,
  review: Review,
  coach: Coach,
  settings: Settings,
};

export default function App() {
  const route = useRoute();
  const Screen = SCREENS[route.path];

  return (
    <AppShell>
      <ErrorBoundary key={route.path}>
        {Screen ? <Screen /> : <NotFound path={route.path} />}
      </ErrorBoundary>
    </AppShell>
  );
}
