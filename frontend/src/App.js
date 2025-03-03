import React, { Fragment, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Components
import ValidateSession from './components/routing/ValidateSession';

// Login
import Login from './views/auth/Login';

// Redux
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

function App() {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<BrowserRouter>
				<Fragment>
          <Routes>
            {/* Log-in */}
            <Route exact path="/" element={<ValidateSession><Login /></ValidateSession>}/>
            <Route exact path="/login" element={<ValidateSession><Login /></ValidateSession>}/>

            {/* Not found */}
            <Route path="*" element={<NoMatch />}/>
          </Routes>
				</Fragment>
			</BrowserRouter>
		</Provider>
	);
}

export default App;