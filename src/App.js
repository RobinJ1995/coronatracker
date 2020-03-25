import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
const countries = require('country-json/src/country-by-population.json');


const getStats = () => fetch('https://pomber.github.io/covid19/timeseries.json')
  .then(res => res.json());
const percentageOf = (total, portion) => parseFloat((portion / total) * 100).toFixed(2);

function App() {
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ stats, setStats ] = useState(null);

  useEffect(() => {
    if (loading || stats) {
      return;
    }

    setLoading(true);
    getStats()
      .then(setStats)
      .catch(setError)
      .then(() => setLoading(false));
  });

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>{error}</p>
  } else if (!stats) {
    return <p>?</p>;
  }

  return <table>
    <thead>
      <tr>
        <th>Country</th>
        <th>Confirmed cases</th>
        <th>Deaths</th>
        <th>Recovered</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(stats).map(countryName => {
        const countryStats = stats[countryName];
        const confirmed = countryStats.reduce((n, { confirmed }, i) => n += confirmed, 0);
        const deaths = countryStats.reduce((n, { deaths }, i) => n += deaths, 0);
        const recovered = countryStats.reduce((n, { recovered }, i) => n += recovered, 0);
        const population = (countries.find(({ country }) => country === countryName) || {}).population;
        const confirmedPercentageOfPopulation = percentageOf(population, confirmed);
        const deathsPercentageOfConfirmed = percentageOf(confirmed, deaths);
        const recoveredPercentageOfConfirmed = percentageOf(confirmed, recovered);

        return (
          <tr>
            <td className="country-name">{countryName}</td>
            <td className={confirmedPercentageOfPopulation > 1 ? 'highlight' : ''}>{confirmed.toLocaleString()}<br />
              {population && <small>{confirmedPercentageOfPopulation}% of population</small>}</td>
            <td className={deathsPercentageOfConfirmed > 5 ? 'highlight' : ''}>{deaths.toLocaleString()}<br />
            <small>{deathsPercentageOfConfirmed}% of confirmed cases</small></td>
            <td className={recoveredPercentageOfConfirmed > 5 ? 'positive' : ''}>{recovered.toLocaleString()}<br />
            <small>{recoveredPercentageOfConfirmed}% of confirmed cases</small></td>
          </tr>
        )
      })}
    </tbody>
  </table>;
}

export default App;
