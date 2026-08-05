import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Activate from './pages/Activate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import LandingPage from './pages/LandingPage';

import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Transactions from './pages/Transactions';
import ApiKeys from './pages/ApiKeys';
import Webhooks from './pages/Webhooks';
import SettingsPage from './pages/Settings';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/activate" component={Activate} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/api-keys" component={ApiKeys} />
      <Route path="/webhooks" component={Webhooks} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
