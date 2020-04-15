import React from 'react';
import ReactMapboxGl, { 
  // Source,
  // Layer, 
  // Image,
  Marker,
  Feature,
  Popup 
} from 'react-mapbox-gl';
// import sampleBatchMapGeo from './exposureData/sampleBatchMap.geojson';
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
      exposureMap: sampleBatchMap,
      isShowingPopup: false,
      popupIndex: undefined
    }
  }

  togglePopup = (idx, popupBool) => {
    return this.setState({
      isShowingPopup: popupBool,
      popupIndex: idx
    })
  }

  renderFeature = () => {
    const { 
      exposureMap, 
      isShowingPopup
    } = this.state;

    exposureMap.features.map((ft, idx) => {
      let content = ft.properties.AddressLine;
      let coords = ft.geometry.coordinates;
      
      if(coords) {
        return <Feature 
          coordinates={coords}
          onMouseEnter={(obj) => { 
            this.togglePopup(idx) 
          }}
          onMouseLeave={() => { 
            this.togglePopup(idx)
          }}>

          {
            isShowingPopup
              && <Popup 
                style={{
                  'height': '200px', 
                  'width': '200px'
                }}
                offset={{
                  'bottom-left': [12, -38],  
                  'bottom': [0, -38], 
                  'bottom-right': [-12, -38]
                }}
                anchor="bottom"
                coordinates={coords}>
                <p>{coords + content}</p>
            </Popup>
          }
        </Feature>      
      }

      return null;
    })
  }

  renderMarker = () => {
    const { 
      exposureMap, 
      isShowingPopup,
      popupIndex 
    } = this.state;
    let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';

    return exposureMap.features.map((ft, idx) => {
      let addressLine = ft.properties.AddressLine;
      let coords = ft.geometry.coordinates;

      if(coords) {
        return <React.Fragment>
          <Marker key={idx}
            coordinates={coords}>
            <img id={'pug'} 
              alt="Map pin"
              style={{
                'width': '30px',
                'cursor': 'pointer',
                'position': 'absolute',
                'z-index': 0
              }}
              src={imagePath}
              onMouseEnter={() => { this.togglePopup(idx, true) }}
              onMouseLeave={() => { this.togglePopup(idx, false) }}/>
          </Marker>

          {
            isShowingPopup 
              && (idx === popupIndex) 
              && <Popup 
              style={{
                'position': 'absolute',
                'z-index': 100,
                'text-align': 'center'
              }}
              offset={{
                'bottom-left': [12, -15],  
                'bottom': [0, -5], 
                'bottom-right': [-12 -15]
              }}
              anchor="bottom"
              coordinates={coords}>
               <strong>{addressLine}</strong>
               <p>{coords}</p>
            </Popup>
          }
        </React.Fragment>
      }

      return null;
    })
  }

  render() {
    const { style, zoom, center } = this.state;
    // let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';

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
          
          {/* <Source id='exposureData'
            type="geojson"
            cluster={true}
            clusterMaxZoom={14}
            clusterRadius={50} /> */}

          {/* <Image 
            id={'pug'} 
            url={imagePath}/> */}

          {/* <Layer 
            type="symbol" 
            id="marker" 
            layout={{ 
              'icon-image': 'pug', 
              'icon-size': 0.15
            }}
            anchor="bottom"> 
              { this.renderFeature() }
          </Layer> */}

          { this.renderMarker() }
        </Map>
      )
    }
  }
}
 
export default App;