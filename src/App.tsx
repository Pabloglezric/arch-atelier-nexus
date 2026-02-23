import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import InteractiveModels from "./pages/InteractiveModels";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Inspiration from "./pages/Inspiration";
import NotFound from "./pages/NotFound";
import ThemeSwitcher from "./components/ThemeSwitcher";
import ClassicMeshBackground from "./components/ui/classic-mesh-background";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeSwitcher />
      <ClassicMeshBackground />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/interactive-models" element={<InteractiveModels />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
