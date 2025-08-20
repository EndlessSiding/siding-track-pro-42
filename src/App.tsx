
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FeaturesProvider } from "@/contexts/FeaturesContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AppProvider } from "@/contexts/AppContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetails from "./pages/clients/ClientDetails";
import ClientEdit from "./pages/clients/ClientEdit";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectEdit from "./pages/projects/ProjectEdit";
import TeamsPage from "./pages/teams/TeamsPage";
import QuotesPage from "./pages/quotes/QuotesPage";
import QuoteDetails from "./pages/quotes/QuoteDetails";
import QuoteEdit from "./pages/quotes/QuoteEdit";
import FinancialPage from "./pages/financial/FinancialPage";
import ReportsPage from "./pages/reports/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import MapPage from "./pages/MapPage";
import BackupPage from "./pages/backup/BackupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <FeaturesProvider>
            <SettingsProvider>
              <AppProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="clients" element={<ClientsPage />} />
                        <Route path="clients/:id" element={<ClientDetails />} />
                        <Route path="clients/:id/edit" element={<ClientEdit />} />
                        <Route path="projects" element={<ProjectsPage />} />
                        <Route path="projects/:id" element={<ProjectDetails />} />
                        <Route path="projects/:id/edit" element={<ProjectEdit />} />
                        <Route path="teams" element={<TeamsPage />} />
                        <Route path="quotes" element={<QuotesPage />} />
                        <Route path="quotes/:id" element={<QuoteDetails />} />
                        <Route path="quotes/:id/edit" element={<QuoteEdit />} />
                        <Route path="financial" element={<FinancialPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="map" element={<MapPage />} />
                        <Route path="backup" element={<BackupPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </AppProvider>
            </SettingsProvider>
          </FeaturesProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
