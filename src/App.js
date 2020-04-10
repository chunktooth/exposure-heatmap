/* eslint-disable react/style-prop-object */
import React from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import './App.scss';

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoib3NhZXRlaG4iLCJhIjoiY2s4a3FraWwyMDRtdTNucW82bGswcXB6biJ9.Ks3reY0Gor-GqRVP9woI8Q',
});

class App extends React.Component {
  constructor() {
    super();
      this.state = {
        center: [5.3753, 35],
        zoom: [1.49],
        style: "mapbox://styles/mapbox/dark-v10"
      }
  } 

  render() {
    const { style, zoom, center } = this.state;

    return (
      <Map
        style={style}
        zoom={zoom}
        center={center}
        containerStyle={{
          height: '100vh',
          width: '100vw'
        }}>
        <Layer 
          type="symbol" 
          id="marker" 
          layout={{ 'icon-image': 'marker-15' }}>
            <Feature 
              coordinates={
                [-0.481747846041145, 51.3233379650232]
              }/>
            <Feature 
              coordinates={
                [32, 51]
              }/>
        </Layer>
      </Map>
    );
  }
}
 
export default App;
