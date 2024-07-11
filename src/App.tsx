import React from 'react';
import './App.css';
import { useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

function App() {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const name = query.get('server')

  return (
    <>
      <Container>
        <h1>React Bootstrap</h1>
        {name ? <h2>Server: {name}</h2> : null}
      </Container>
    </>
  );
}

export default App;
