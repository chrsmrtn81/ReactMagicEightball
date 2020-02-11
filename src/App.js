import React from 'react';
import './App.scss';
import Eightball from './components/Eightball';
import Header from './components/Header';

function App() {

	// Global variables
	window.globalVars = {
		apiURL: 'http://localhost:1337/'
	};
  
  	return (
    	<div className="App">
			<Header/>
			<Eightball />
    	</div>
	);  
}

export default App;
