import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import BusinessCenter from "./pages/BusinessCenter";
import NafathUsername from "./pages/NafathUsername";
import BusinessCenterInfo from "./pages/BusinessCenterInfo";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Services} />
      <Route path={"/business-center"} component={BusinessCenter} />
      <Route path={"/nafath-username"} component={NafathUsername} />
      <Route path={"/business-center-info"} component={BusinessCenterInfo} />
      <Route path={"/service/:id?"} component={Home} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

// Activation Checkpoint Trigger
