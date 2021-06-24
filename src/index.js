import React from 'react';
import ReactDOM from 'react-dom';
import {
    App
} from './App';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3001/api',
    cache: new InMemoryCache()
});

// client.query({
//     query: gql `
//   query {
//         getEmployees{
//             status
//               data{
//                 name
//                 age
//                 username
//                 hiredate
//                 }
//             }
//         }
//         `
// }).then((result) => {
//     debugger
//     console.log(result)
// });

// const EXCHANGE_RATES = gql`
//      query {
//          getEmployees{
//              status
//                data{
//                  name
//                  age
//                  username
//                  hiredate
//                  }
//              }
//          }
// `;

// function ExchangeRates() {
//     const { loading, error, data } = useQuery(EXCHANGE_RATES);
  
//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error :(</p>;
//     debugger
//     return data.getEmployees.data.map((employee,index) => (
//       <div key={index}>
//         <p>
//           username: {employee.username}
//         </p>
//       </div>
//     ));
//   }

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);