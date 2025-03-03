import React, { Fragment, useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/* Components */
import Alert from './components/layout/Alert';
import NoMatch from './components/routing/NoMatch';
import ValidateSession from './components/routing/ValidateSession';
import PrivateRoute from './components/routing/PrivateRoute';

/* Views */

//Authtentication
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';

//Home
import Home from './views/home/Home';

/* Redux */
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
					<section className="container-fluid principal-section">
						<Alert></Alert>
						
						<Routes>
							{/* Log-in */}
							<Route exact path="/" element={<ValidateSession><Login /></ValidateSession>}/>
							<Route exact path="/login" element={<ValidateSession><Login /></ValidateSession>}/>

							{/* Sign-up */}
							<Route exact path="/signup" element={<ValidateSession><Signup /></ValidateSession>}/>

							{/* Home */}
							<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}/>

							{/* Not found */}
							<Route path="*" element={<NoMatch />}/>
						</Routes>
					</section>
				</Fragment>
			</BrowserRouter>
		</Provider>
	);
}

export default App;