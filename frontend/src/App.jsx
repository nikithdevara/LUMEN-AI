import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Landing from '@/pages/Landing';
import Onboarding from '@/pages/Onboarding';
import Workspace from '@/pages/Workspace';
import StoryExperience from '@/pages/StoryExperience';
import Reflection from '@/pages/Reflection';
import KnowledgeCheck from '@/pages/KnowledgeCheck';
import Recommendations from '@/pages/Recommendations';
import ResourceLibrary from '@/pages/ResourceLibrary';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Dashboard from '@/pages/Dashboard';
import AIStudio from '@/pages/AIStudio';
import PosterGenerator from '@/pages/AIStudio/Poster';
import CampaignGenerator from '@/pages/AIStudio/Campaign';
import PresentationGenerator from '@/pages/AIStudio/Presentation';
import DocumentGenerator from '@/pages/AIStudio/Document';
import SocialMediaGenerator from '@/pages/AIStudio/Social';
import VideoScriptGenerator from '@/pages/AIStudio/Video';
import NGOResourceEngine from '@/pages/AIStudio/NGO';
import GovernmentResourceEngine from '@/pages/AIStudio/Government';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
              <Route element={<AppLayout />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/story/:id" element={<StoryExperience />} />
                <Route path="/reflection/:id" element={<Reflection />} />
                <Route path="/knowledge-check/:id" element={<KnowledgeCheck />} />
                <Route path="/quiz/:id" element={<KnowledgeCheck />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/resources" element={<ResourceLibrary />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-studio" element={<AIStudio />} />
                <Route path="/ai-studio/poster" element={<PosterGenerator />} />
                <Route path="/ai-studio/campaign" element={<CampaignGenerator />} />
                <Route path="/ai-studio/presentation" element={<PresentationGenerator />} />
                <Route path="/ai-studio/document" element={<DocumentGenerator />} />
                <Route path="/ai-studio/social" element={<SocialMediaGenerator />} />
                <Route path="/ai-studio/video" element={<VideoScriptGenerator />} />
                <Route path="/ai-studio/ngo" element={<NGOResourceEngine />} />
                <Route path="/ai-studio/government" element={<GovernmentResourceEngine />} />
              </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App