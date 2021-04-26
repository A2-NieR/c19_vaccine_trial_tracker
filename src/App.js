import './App.css';
import React, { useState } from 'react';
import { Toolbar, Button } from '@material-ui/core';
import 'typeface-roboto';

import Trials from './components/Trials';
import data from './data/vaccines.json';

const App = () => {
  const [vaccine, setVaccine] = useState();

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Covid-19 Vaccine Clinical Trial Tracker</h1>
      </header>
      <div className='buttons'>
        <Toolbar className='selector'>
          {data.vaccines.map((vax) => (
            <Button
              id={vax.name}
              key={vax.id}
              color='inherit'
              onClick={() => setVaccine(vax)}>
              {vax.name}
            </Button>
          ))}
        </Toolbar>
      </div>
      {vaccine !== undefined && <Trials vaccine={vaccine} />}
      {vaccine === undefined && (
        <div style={{ textAlign: 'center', paddingTop: '2em' }}>
          <p>
            This tools is intended to give an overview of clinical trials of
            current Covid-19 vaccines.
          </p>
          <p>
            The data is gathered directly from{' '}
            <a href='https://www.clinicaltrials.gov'>clinicaltrials.gov</a>{' '}
            using their API. Every trial listed can be viewed in a new tab using
            the button at the end of a row.
          </p>
          <p>
            <b>To start, simply click on one of the names in the toolbar.</b>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
