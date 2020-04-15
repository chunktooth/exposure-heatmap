import React from 'react';
import sampleBatchMap from './exposureData/sampleBatchMap.geojson';
import ReactMapGL, { Source, Layer } from 'react-map-gl';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      mapboxApiAccessToken: 'pk.eyJ1Ijoib3NhZXRlaG4iLCJhIjoiY2s4a3FraWwyMDRtdTNucW82bGswcXB6biJ9.Ks3reY0Gor-GqRVP9woI8Q',
      viewport: {
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8
      }
    }
  }

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
        mapboxApiAccessToken={this.state.mapboxApiAccessToken}>
        <Source
          type="geojson"
          data={sampleBatchMap}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
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
