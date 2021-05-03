import React, { forwardRef } from 'react';
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

const Trials = ({ vaccine, info, number }) => {
  // Redirect urls for trials
  const openStudy = (NCTId) => {
    const url = `https://clinicaltrials.gov/ct2/show/study/${NCTId}`;
    window.open(url, '_blank');
  };

  const setRows = () => {
    if (number <= 5) {
      return 5;
    } else if (number <= 10) {
      return 10;
    } else {
      return 20;
    }
  };

  const searchResult = `Results for '${info.id}':`;

  return (
    <div style={{ maxWidth: '100%' }}>
      {info !== undefined && (
        <div className='info'>
          <div className='infoName'>
            <b>Name:</b>&nbsp;{info.name}
          </div>
          <div className='infoTrade'>
            <b>Tradename:</b>&nbsp;{info.tradeName}
          </div>
          <div className='infoType'>
            <b>Vaccine-Type:</b>&nbsp;{info.type}
          </div>
        </div>
      )}
      {vaccine !== undefined && (
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
          data={vaccine}
          actions={[
            {
              icon: tableIcons.OpenInBrowser,
              tooltip: 'Go to study',
              onClick: (event, rowData) => openStudy(rowData.NCTId)
            }
          ]}
          options={{
            actionsColumnIndex: -1,
            pageSize: setRows(),
            headerStyle: { backgroundColor: '#eceff1' },
            search: false
          }}
        />
      )}
    </div>
  );
};

export default Trials;
