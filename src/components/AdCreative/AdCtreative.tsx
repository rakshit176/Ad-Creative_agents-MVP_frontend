// @ts-nocheck
import { Auth0Provider } from '@auth0/auth0-react';
import { createStore } from 'polotno/model/store';
import { unstable_setAnimationsEnabled } from 'polotno/config';
import { createProject, ProjectContext } from './project';
import { ErrorBoundary } from 'react-error-boundary';

import App from './App';
import './logger';

unstable_setAnimationsEnabled(true);

const store = createStore({ key: 'nFA5H9elEytDyPyvKL7T' });
window.store = store;
store.addPage();

const project = createProject({ store });
window.project = project;

const AUTH_DOMAIN = '';
const PRODUCTION_ID = "null";
const LOCAL_ID = "null";

const isLocalhost = true
const ID = isLocalhost ? LOCAL_ID : PRODUCTION_ID;
const REDIRECT = isLocalhost ? 'http://0.0.0.0:5173' : 'Production Link';

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <p>Something went wrong in the app.</p>
        <p>Try to reload the page.</p>
        <p>If it does not work, clear cache and reload.</p>
        <button
          onClick={async () => {
            await project.clear();
            window.location.reload();
          }}
        >
          Clear cache and reload
        </button>
      </div>
    </div>
  );
}

function AdCtreative() {
  return (
    <div>
      <ErrorBoundary
        FallbackComponent={Fallback}
        onReset={(details) => {
          // Reset the state of your app so the error doesn't happen again
        }}
        onError={(e) => {
          if (window?.Sentry) {
            window.Sentry.captureException(e);
          }
        }}
      >
        <ProjectContext.Provider value={project}>
            <App store={store} />
        </ProjectContext.Provider>
      </ErrorBoundary>
    </div>
  )
}

export default AdCtreative