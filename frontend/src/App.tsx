import React from 'react';
import ApolloClient from 'apollo-boost';

import './App.css';
import { ApolloProvider } from '@apollo/react-hooks';
import CircleChartContainer from 'containers/CircleChartContainer';

const client = new ApolloClient({
  uri: 'http://localhost:5001/graphql',
});

const App = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <CircleChartContainer />
    </div>
  </ApolloProvider>
);

export default App;
