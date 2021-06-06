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
  const [menu, setMenu] = useState('about');
  const [length, setLength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        for (let i = 0; i < data.vaccines.length; i++) {
          const request = `https://clinicaltrials.gov/api/query/study_fields?expr=${data.vaccines[i].id}&fields=Condition,OfficialTitle,Phase,StartDate,CompletionDate,LastUpdatePostDate,EnrollmentCount,NCTId&fmt=json`;

          const response = await axios.get(request);
          const responseData = response.data.StudyFieldsResponse.StudyFields;

          let active = 0;
          let completed = 0;

          for (let i = 0; i < responseData.length; i++) {
            if (new Date(responseData[i].CompletionDate) - new Date() >= 0) {
              active++;
            } else {
              completed++;
            }
          }

          responseData[0].activeTrials = active;
          responseData[0].completedTrials = completed;

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

  useEffect(() => {
    setLength(localStorage.length);
  }, [length]);

  const getActive = (name) =>
    JSON.parse(localStorage.getItem(name))[0].activeTrials;

  const getCompleted = (name) =>
    JSON.parse(localStorage.getItem(name))[0].completedTrials;

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
      {menu === 'home' && length === 10 && (
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
                <p className='active'>Active Trials: {getActive(vax.name)}</p>

                <p className='completed'>
                  Completed Trials:
                  {getCompleted(vax.name)}
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
