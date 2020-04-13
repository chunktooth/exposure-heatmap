import React from 'react';
import ReactMapboxGl, { 
  Layer, 
  Feature,
  Image,
  Popup 
} from 'react-mapbox-gl';
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
      let content = ft.properties.AddressLine;
      let coords = ft.geometry.coordinates;
      
      if(coords) {
        return <Feature 
          coordinates={coords}
          onMouseEnter={(e) => {
            return <Popup 
              offset={{
                'bottom-left': [12, -38],  
                'bottom': [0, -38], 
                'bottom-right': [-12, -38]
              }}
              anchor="bottom"
              coordinates={coords}>
                <p>{coords + content}</p>
            </Popup>
          }}/>
      }

      return null;
    })
  }

  render() {
    const { style, zoom, center } = this.state;
    let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';

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
          interactive={true}
          renderChildrenInPortal={true}>

          <Image 
            id={'pug'} 
            url={imagePath}/>

          <Layer 
            type="symbol" 
            id="marker" 
            layout={{ 
              'icon-image': 'pug', 
              'icon-size': 0.15
            }}
            anchor="bottom"> 
              { this.renderFeature() }
          </Layer>

        </Map>
      );
    }
  }
}
 
export default App;