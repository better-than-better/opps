import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  document.title = 'simple demo';

  return (
    <div className="simple-demo">simple demo</div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}