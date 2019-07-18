import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from '@components/hello-world';

import API from '@api'

const App = () => {
  const fetchSomeData = async () => {
    const data = await API.fetchSomeData();

    console.log(data);
  };

  useEffect(() => {
    fetchSomeData();
  }, true);

  return (
    <div>
      <HelloWorld />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}