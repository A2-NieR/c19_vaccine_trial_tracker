import React, { useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  OpenInBrowser: forwardRef((props, ref) => (
    <OpenInBrowser {...props} ref={ref} />
  )),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const Trials = ({ vaccine }) => {
  const [trials, setTrials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = `https://clinicaltrials.gov/api/query/study_fields?expr=${vaccine.id}&fields=Condition,OfficialTitle,Phase,StartDate,CompletionDate,LastUpdatePostDate,EnrollmentCount,NCTId&fmt=json`;

        const response = await axios.get(request);
        setTrials(response.data.StudyFieldsResponse.StudyFields);
      } catch (error) {
        throw new Error(error);
      }
    };

    fetchData();

    if (trials !== []) {
      for (let i = 0; i < trials.length; i++) {
        trials[i].EnrollmentCount[0] = parseFloat(
          trials[i].EnrollmentCount[0]
        ).toLocaleString();

        // trials[i].StartDate[0] = new Date(trials[i].StartDate[0]);
        // trials[i].CompletionDate[0] = new Date(trials[i].CompletionDate[0]);
        // trials[i].LastUpdate[0] = new Date(trials[i].LastUpdate[0]);
        // console.log(trials);
      }
    }
  }, [vaccine.id]);

  // Redirect urls for trials
  const openStudy = (NCTId) => {
    const url = `https://clinicaltrials.gov/ct2/show/study/${NCTId}`;
    window.open(url, '_blank');
  };

  const searchResult = `Results for '${vaccine.id}':`;

  return (
    <div style={{ maxWidth: '100%' }}>
      {trials !== [] && (
        <div className='info'>
          <b>Name:</b>&nbsp;{vaccine.name}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b>Tradename:</b>&nbsp;{vaccine.tradeName}
          &nbsp;&nbsp;&nbsp;&nbsp;
          <b>Vaccine-Type:</b>&nbsp;{vaccine.type}
        </div>
      )}
      {trials !== [] && (
        <MaterialTable
          icons={tableIcons}
          title={searchResult}
          columns={[
            {
              title: 'Title',
              field: 'OfficialTitle',
              cellStyle: { width: '50%' }
            },
            { title: 'Phase', field: 'Phase' },
            { title: 'Start Date', field: 'StartDate' },
            {
              title: 'Completion Date',
              field: 'CompletionDate',
              cellStyle: (e, rowData) => {
                if (new Date(rowData.CompletionDate[0]) > new Date()) {
                  return { color: 'red' };
                } else {
                  return { color: 'green' };
                }
              }
            },
            { title: 'Last Update', field: 'LastUpdatePostDate' },
            {
              title: 'Participants',
              field: 'EnrollmentCount'
            },
            { title: 'NCTId', field: 'NCTId' }
          ]}
          data={trials}
          actions={[
            {
              icon: tableIcons.OpenInBrowser,
              tooltip: 'Go to study',
              onClick: (event, rowData) => openStudy(rowData.NCTId)
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: 20,
            headerStyle: { backgroundColor: '#eceff1' }
          }}
        />
      )}
    </div>
  );
};

export default Trials;
