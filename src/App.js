import Main from './modules/Main';
import { Toast } from 'primereact/toast';
import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from './redux/features/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import React, { Fragment } from 'react';

import { ScrollTop } from 'primereact/scrolltop';
import './App.css'

function App() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const toastOptions = useSelector(state => state.toast)

  useEffect(() => {
    if (toastOptions.severity) {
      const show = () => {
        toast.current.show({ ...toastOptions });
      };
      show();
      dispatch(hideToast());
    }
  }, [toastOptions])

  return (
    <Fragment>
      <ScrollTop />
      <ConfirmDialog />
      <Toast ref={toast} />
      <Main />
    </Fragment>
  );
}

export default App;