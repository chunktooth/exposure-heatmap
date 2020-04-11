import React from 'react';

import ReactMapboxGl, { 
  Layer, 
  Feature,
  // Image 
} from 'react-mapbox-gl';
// import batchGeoJSON from './exposureData/sampleBatchMap.geojson';
import sampleBatchMap from './exposureData/sampleBatchMap.json';
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
      style: "mapbox://styles/mapbox/dark-v10",
      exposureMap: sampleBatchMap
    }
  }

  renderFeature = () => {
    const { exposureMap } = this.state;

    return exposureMap.features.map(ft => {
      let coords = ft.geometry.coordinates;
      // let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';
      if(coords) {
        return <Feature coordinates={coords}/>
        // return <Image 
        //   id={'exposure'} 
        //   url={imagePath} 
        //   data={batchGeoJSON}  
        // />
      }

      return null;
    })
  }

  render() {
    const { style, zoom, center } = this.state;

    if(this.state.exposureMap)  {
      return (
        <Map
          style={style}
          zoom={zoom}
          center={center}
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          interactive={true}>
          <Layer 
            type="symbol" 
            id="marker" 
            layout={{ 'icon-image': 'marker-15' }}> 
            { this.renderFeature() }
          </Layer>
        </Map>
      );
    }
  }
}
 
export default App;