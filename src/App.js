import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toolbar, Button } from '@material-ui/core';
import 'typeface-roboto';

import Trials from './components/Trials';
import data from './data/vaccines.json';

const App = () => {
  const [vaccine, setVaccine] = useState();
  const [info, setInfo] = useState();
  const [menu, setMenu] = useState('home');

  useEffect(() => {
    const fetchData = async () => {
      try {
        for (let i = 0; i < data.vaccines.length; i++) {
          const request = `https://clinicaltrials.gov/api/query/study_fields?expr=${data.vaccines[i].id}&fields=Condition,OfficialTitle,Phase,StartDate,CompletionDate,LastUpdatePostDate,EnrollmentCount,NCTId&fmt=json`;

          const response = await axios.get(request);
          const responseData = response.data.StudyFieldsResponse.StudyFields;
          localStorage.setItem(
            data.vaccines[i].name,
            JSON.stringify(responseData)
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchData();
  }, []);

  const getActiveTrials = (name) => {
    let counter = 0;
    const object = JSON.parse(localStorage.getItem(name));
    if (object) {
      for (let i = 0; i < object.length; i++) {
        const complDate = object[i].CompletionDate[0];
        if (complDate !== undefined && new Date(complDate) - new Date() >= 0) {
          counter++;
        }
      }
    }
    return counter;
  };

  const getCompletedTrials = (name) => {
    let counter = 0;
    const object = JSON.parse(localStorage.getItem(name));
    if (object) {
      for (let i = 0; i < object.length; i++) {
        const complDate = object[i].CompletionDate[0];
        if (complDate !== undefined && new Date(complDate) - new Date() < 0) {
          counter++;
        }
      }
    }
    return counter;
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Covid-19 Vaccine Clinical Trial Tracker</h1>
        <div className='menu'>
          <Toolbar className='selector'>
            <Button
              id='home'
              key='home'
              color='inherit'
              onClick={() => setMenu('home')}>
              HOME
            </Button>
            <Button
              id='about'
              key='about'
              color='inherit'
              onClick={() => setMenu('about')}>
              ABOUT
            </Button>
          </Toolbar>
        </div>
      </header>
      {menu === 'home' && (
        <div className='container'>
          <div className='grid'>
            {data.vaccines.map((vax) => (
              <button
                className='tile'
                key={`button-${vax.id}`}
                onClick={() => {
                  setVaccine(JSON.parse(localStorage.getItem(vax.name)));
                  setInfo(vax);
                  setMenu();
                }}>
                <h2>{vax.name}</h2>
                <p className='active'>
                  Active Trials: {getActiveTrials(vax.name)}
                </p>
                <p className='completed'>
                  Completed Trials:{getCompletedTrials(vax.name)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {vaccine !== undefined && menu === undefined && (
        <Trials vaccine={vaccine} info={info} number={vaccine.length} />
      )}
      {menu === 'about' && (
        <div style={{ textAlign: 'center', padding: '2em' }}>
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
            <b>
              To start, simply click on one of the buttons in the home area.
            </b>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
