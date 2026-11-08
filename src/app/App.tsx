import { useEffect } from 'react';
import { AppShell } from '../components/AppShell';
import { SectionGate } from '../components/SectionGate';
import { StorageNotice } from '../components/StorageNotice';
import { SECTIONS } from '../data/sections';
import { EndingPage } from '../features/endings/EndingPage';
import { HubPage } from '../features/investigation/HubPage';
import { useAmbientSound } from '../hooks/useAmbientSound';
import { useMotionPreference } from '../hooks/useMotionPreference';
import { LandingPage } from '../pages/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { useGame } from '../store/GameContext';
import { isWithin, redirect, usePath } from './router';

function InvestigationRoute({ path }: { path: string }) {
  if (path === '/hub') return <HubPage />;
  const section = SECTIONS.find((candidate) => isWithin(path, candidate.path));
  return section ? <SectionGate section={section} /> : <NotFoundPage />;
}

export function App() {
  const path = usePath();
  const { state } = useGame();
  useMotionPreference(state.settings.motion);
  useAmbientSound(state.settings.sound);

  const mustOpenCaseFirst = path !== '/' && state.startedAt === null;

  useEffect(() => {
    if (mustOpenCaseFirst) redirect('/');
  }, [mustOpenCaseFirst]);

  return (
    <>
      {path === '/' || mustOpenCaseFirst ? (
        <LandingPage />
      ) : path === '/ending' ? (
        <EndingPage />
      ) : (
        <AppShell path={path}>
          <InvestigationRoute path={path} />
        </AppShell>
      )}
      <StorageNotice />
    </>
  );
}
