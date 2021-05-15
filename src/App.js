import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import "./App.css";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {prettyPrintStat, sortData} from './util';
import VaccineSlot from './VaccineSlot';
import NewsFeed from './NewsFeed';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter,setMapCenter] = useState({lat:34.80746,lng:-40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries,setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");



  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])

  useEffect(() => {
    //The code here runs only once when component loads and not again
    //async -> sends a request , wait for it, something will return
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2, //UK,IND,FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(countryCode);

      const url = countryCode === "worldwide" ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);

      //All of the data from the country response
      setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

    })
  };

  return (
    <div className="app">

      <div className="app__left">
      <div className="app__header">
        {/* Header */}
        {/* Title + Select country Dropdown */}

        <h1> CoviResource. </h1>
        <FormControl className="app__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            {/* Loop through all countries and show drop down list of options */}

            {/* 
        
         <MenuItem value="worldwide">option 1</MenuItem>
         <MenuItem value="worldwide">option 2</MenuItem>
<MenuItem value="worldwide">option 3</MenuItem> */}
            <MenuItem value="worldwide">Worldwide</MenuItem>

            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">

        {/* <h1 class="heading-center">{country}</h1> */}

              <InfoBox  active={casesType === "cases"}  onClick = {(e) => setCasesType('cases')} title="Covid Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
              <InfoBox  active={casesType === "recovered"} onClick = {(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
              <InfoBox  active={casesType === "deaths"} onClick = {(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      {/* InfoBoxes title = "covid cases" */}
      {/* InfoBoxes title = "covid recoveries" */}
      {/* InfoBoxes */}
      </div>


      {/* Map */}
        
        <Map
        casesType = {casesType}
        countries = {mapCountries}
        center={mapCenter}
        zoom = {mapZoom}
        />
     

      {/* Vaccine Slot Availability India  */}

              {/* <VaccineSlot/> */}

      
      </div>

      <Card className="app__right">
      <CardContent>
        <h3 style={{textAlign:"center", paddingBottom:"3px"}}>Live Cases by Country</h3>
        <Table countries = {tableData}/>
         {/* Table */}
         
         {/* <NewsFeed/> */}
         {/* <LineGraph/> */}
      {/* Graph */}
       {/* News Feed India */}
      </CardContent>

        
      <h3 style={{textAlign:"center", paddingBottom:"3px", color:"red"}}>Developed by Suhas Holla</h3>

      </Card>
     
    </div>
  );
}

export default App;
