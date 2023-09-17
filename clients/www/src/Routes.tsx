import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './routes/index';
import routerType from './types/router';

const App = () => {
  // Create an array to store your route elements
  const routeElements = routes.map(({ path, element: component, exact, notProtected }: routerType) => {
    if (component) {
      if (notProtected) {
        if (path) {
          return !exact ? (
            <Route key={path} path={path + '*'} element={component} />
          ) : (
            <Route key={path} path={path} element={component} />
          );
        } else {
          // Handle the case when path is not defined
          return <Route key={component.key} element={component} />;
        }
      } else {
        if (path) {
          return exact ? (
            <Route key={path} path={path + '*'} element={component} />
          ) : (
            <Route key={path} path={path} element={component} />
          );
        } else {
          return <Route key={component.key} element={component} />;
        }
      }
    }
    return null; // Handle cases where component is undefined
  });

  console.log('Generated Routes:', routeElements);

  return (
    <BrowserRouter>
      <Routes>{routeElements}</Routes>
    </BrowserRouter>
  );
};

export default App;
