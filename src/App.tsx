import { useEffect, useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { Workspace } from './components/layout/Workspace';

function isWorkspaceHash(hash: string): boolean {
  return hash === '#/workspace' || hash === '#workspace' || hash === '#workspace/';
}

export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const route = isWorkspaceHash(hash) ? 'workspace' : 'home';

  useEffect(() => {
    document.body.dataset.page = route;
    return () => {
      delete document.body.dataset.page;
    };
  }, [route]);

  useEffect(() => {
    if (route === 'workspace' || !hash || hash === '#/') {
      window.scrollTo(0, 0);
      return;
    }

    const sectionId = decodeURIComponent(hash.replace(/^#\/?/, ''));
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, route]);

  return (
    <div className={`app app--${route}`}>
      {route === 'workspace' ? <Workspace /> : <LandingPage />}
    </div>
  );
}
