import React from 'react';
import sampleBatchMap from './sampleData/sampleBatchMap.geojson';
import exposureData from './sampleData/sampleBatchMap.json';
import ReactMapGL, { 
  Source, 
  Layer, 
  Marker, 
  Popup 
} from 'react-map-gl';
import { token } from './sampleData/token';

// const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
//   c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
//   C20.1,15.8,20.2,15.8,20.2,15.7z`;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      mapboxApiAccessToken: token,
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 5.3753,
        longitude: 35,
        zoom: 1.49
      },
      popupInfo: undefined,
      exposureData: exposureData
    }
  }

  // displayPopupModal = () => {
  //   const { popupInfo } = this.state;
    
  //   return popupInfo &&
  //     <Popup
  //       tipSize={5}
  //       anchor="top"
  //       longitude={popupInfo.longitude}
  //       latitude={popupInfo.latitude}
  //       closeOnClick={false}
  //       onClose={() => this.setState({popupInfo: null})}>
  //       <p>{popupInfo.latitude + popupInfo.longitude}</p>
  //     </Popup>;
  // }

  // onLayerHover = (ft) => {
  //   let data = ft;
  //   this.setState({ popupInfo: data });
  // }

  // displayMarker = () => {
  //   return exposureData.features.map((ft, idx) => {
  //     // let addressLine = ft.properties.AddressLine;
  //     let coords = ft.geometry.coordinates;
  //     let size = 20;

  //     return <React.Fragment>
  //       <Marker 
  //         key={`marker-${idx}`} 
  //         coordinates={coords}> 

  //           <svg
  //             height={size}
  //             viewBox="0 0 24 24"
  //             style={{
  //               cursor: 'pointer',
  //               fill: '#d00',
  //               stroke: 'none',
  //               transform: `translate(${-size / 2}px,${-size}px)`
  //             }}
  //             onMouseEnter={() => this.onLayerHover(ft)}>
  //             <path d={ICON} />
  //           </svg>
  //       </Marker>

  //       { this.displayPopupModal() }
  //     </React.Fragment>
  //   })
  // }

  render() {
    const clusterLayer = {
      id: 'clusters',
      type: 'circle',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
      }
    };

    const clusterCountLayer = {
      id: 'cluster-count',
      type: 'symbol',
      source: 'earthquakes',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    };

    const unclusteredPointLayer = {
      id: 'unclustered-point',
      type: 'circle',
      source: 'earthquakes',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 4,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    };

    return (
      <ReactMapGL {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        mapStyle='mapbox://styles/mapbox/dark-v10'
        mapboxApiAccessToken={this.state.mapboxApiAccessToken}>
        
        {/* { this.displayMarker() } */}
        <Source
          type="geojson"
          data={sampleBatchMap}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={20}
          ref={this._sourceRef}>

          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

      </ReactMapGL>
    )
  }
}

export default App;
