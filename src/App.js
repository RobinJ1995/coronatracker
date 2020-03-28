import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './App.css';
import Chart from './Chart';
const countries = require('country-json/src/country-by-population.json');


const getStats = () => fetch('https://pomber.github.io/covid19/timeseries.json')
  .then(res => res.json());
const percentageOf = (total, portion) => parseFloat((portion / total) * 100).toFixed(2);
const findLastNumber = (countryStats, statistic) => (countryStats.sort(({ date: a }, { date: b }) => new Date(b) - new Date(a))
  .find(dayStat => dayStat[statistic] !== null && dayStat[statistic] !== undefined) || {})[statistic];
const getPopulation = countryName => (countries.find(({ country }) => country === (countryName == 'US' ? 'United States' : countryName)) || {}).population;

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

  return <Container fixed>
    <Grid container spacing={3}>
      {Object.keys(stats).map(countryName => {
        const countryStats = stats[countryName];
        const confirmed = findLastNumber(countryStats, 'confirmed');
        const deaths = findLastNumber(countryStats, 'deaths');
        const recovered = findLastNumber(countryStats, 'recovered');
        const population = getPopulation(countryName);
        const confirmedPercentageOfPopulation = percentageOf(population, confirmed);
        const deathsPercentageOfConfirmed = percentageOf(confirmed, deaths);
        const recoveredPercentageOfConfirmed = percentageOf(confirmed, recovered);

        return <Grid item xs={12}>
          <h2 className="country-name">{countryName}</h2>

          <Paper>
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <Grid container spacing={1} style={{ padding: '8px 12px' }}>
                  <Grid item xs={4} md={12}>
                    <span className={confirmedPercentageOfPopulation > 0.5 ? 'highlight' : ''}>{confirmed.toLocaleString()} confirmed cases<br />
                      {population ? <small>{confirmedPercentageOfPopulation}% of population</small> : ''}</span>
                  </Grid>
                  <Grid item xs={4} md={12}>
                    {Number.isInteger(deaths) ? 
                      <td className={deathsPercentageOfConfirmed > 5 ? 'highlight' : ''}>{deaths.toLocaleString()} deaths<br />
                        <small>{deathsPercentageOfConfirmed}% of confirmed cases</small></td> : ''}
                  </Grid>
                  <Grid item xs={4} md={12}>
                    {Number.isInteger(recovered) ? 
                      <td className={recoveredPercentageOfConfirmed > 5 ? 'positive' : ''}>{recovered.toLocaleString()} deaths<br />
                        <small>{recoveredPercentageOfConfirmed}% of confirmed cases</small></td> : ''}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={9}>
                <Chart countryData={countryStats.sort(({ date: a }, { date: b }) => new Date(a) - new Date(b))} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>;
      })}
    </Grid>
  </Container>;
}

export default App;
