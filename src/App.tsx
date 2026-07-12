import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { RefreshProvider } from './context/RefreshContext';
import { ThemeProvider } from './context/ThemeContext';
import { HomePage } from './pages/HomePage';
import { ItineraryPage } from './pages/ItineraryPage';
import { DayDetailPage } from './pages/DayDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { PlacesPage } from './pages/PlacesPage';
import { DontMissPage } from './pages/DontMissPage';
import { JournalPage } from './pages/JournalPage';
import { PhrasesPage } from './pages/PhrasesPage';
import { SetupPage } from './pages/SetupPage';
import { QuickRefPage } from './pages/QuickRefPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { MorePage } from './pages/MorePage';
import { WeatherPage } from './pages/WeatherPage';
import { TripBingoPage } from './pages/TripBingoPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { FalloutPage } from './pages/FalloutPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <RefreshProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/itinerary/:dayId" element={<DayDetailPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/bingo" element={<TripBingoPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/dont-miss" element={<DontMissPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/fallout" element={<FalloutPage />} />
          <Route path="/phrases" element={<PhrasesPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/quick-ref" element={<QuickRefPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
      </HashRouter>
      </RefreshProvider>
    </ThemeProvider>
  </ErrorBoundary>
  );
}
