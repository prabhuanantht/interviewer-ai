import { InterviewProvider, useInterview } from './context/InterviewContext';
import { SetupScreen } from './components/Setup/SetupScreen';
import { InterviewScreen } from './components/Interview/InterviewScreen';
import { FeedbackScreen } from './components/Feedback/FeedbackScreen';
import './App.css';

function AppContent() {
  const { state } = useInterview();

  return (
    <div className="app-container">
      {state.interviewStatus === 'setup' && <SetupScreen />}
      {state.interviewStatus === 'active' && <InterviewScreen />}
      {state.interviewStatus === 'feedback' && <FeedbackScreen />}
    </div>
  );
}

function App() {
  return (
    <InterviewProvider>
      <AppContent />
    </InterviewProvider>
  );
}

export default App;
