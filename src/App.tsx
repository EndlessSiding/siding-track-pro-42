
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { FeaturesProvider } from "@/contexts/FeaturesContext";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Projects
import ProjectsPage from "@/pages/projects/ProjectsPage";
import ProjectDetails from "@/pages/projects/ProjectDetails";
import ProjectEdit from "@/pages/projects/ProjectEdit";

// Clients
import ClientsPage from "@/pages/clients/ClientsPage";
import ClientDetails from "@/pages/clients/ClientDetails";
import ClientEdit from "@/pages/clients/ClientEdit";

// Teams
import TeamsPage from "@/pages/teams/TeamsPage";

// Quotes
import QuotesPage from "@/pages/quotes/QuotesPage";
import QuoteDetails from "@/pages/quotes/QuoteDetails";
import QuoteEdit from "@/pages/quotes/QuoteEdit";

// Financial
import FinancialPage from "@/pages/financial/FinancialPage";

// Reports
import ReportsPage from "@/pages/reports/ReportsPage";

// Map
import MapPage from "@/pages/MapPage";

// Settings
import SettingsPage from "@/pages/settings/SettingsPage";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <SettingsProvider>
            <FeaturesProvider>
              <AppProvider>
                <Router>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/projects/:id" element={<ProjectDetails />} />
                      <Route path="/projects/:id/edit" element={<ProjectEdit />} />
                      
                      <Route path="/clients" element={<ClientsPage />} />
                      <Route path="/clients/:id" element={<ClientDetails />} />
                      <Route path="/clients/:id/edit" element={<ClientEdit />} />
                      
                      <Route path="/teams" element={<TeamsPage />} />
                      
                      <Route path="/quotes" element={<QuotesPage />} />
                      <Route path="/quotes/:id" element={<QuoteDetails />} />
                      <Route path="/quotes/:id/edit" element={<QuoteEdit />} />
                      
                      <Route path="/financial" element={<FinancialPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/map" element={<MapPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                  <Toaster />
                </Router>
              </AppProvider>
            </FeaturesProvider>
          </SettingsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
