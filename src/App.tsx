import "./App.css";
import { Route, Routes } from "react-router";
import { UserListScreen } from "./presentation/screens/UserListScreen";
import { UserDetailScreen } from "./presentation/screens/UserDetailScreen";
import { ServiceLocatorContextProvider } from "./presentation/context/ServiceLocatorContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IntlProvider } from "react-intl";

const queryClient = new QueryClient();

function App() {
  return (
    <IntlProvider defaultLocale="en-us" locale="en-us">
      <QueryClientProvider client={queryClient}>
        <ServiceLocatorContextProvider>
          <Routes>
            <Route path="user/{id}" element={<UserDetailScreen />} />
            <Route path="user" element={<UserListScreen />} />
          </Routes>
        </ServiceLocatorContextProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}

export default App;
