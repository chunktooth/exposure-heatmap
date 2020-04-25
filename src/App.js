import React from 'react';
import mapboxgl from 'mapbox-gl';
import sampleBatchMap from './sampleData/sampleBatchMap.geojson';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        lng: 5.3753,
        lat: 29.6213,
        zoom: 1.49,
        sourceName: undefined
      };
    }

  componentDidMount() {
    this.configureMapbox();
    this.storeCoordinates();
    this.onLoadMap();
  };

  configureMapbox = () => {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    this.popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
  }

  storeCoordinates = () => {
    this.map.on('move', () => {
      this.setState({
        // Get center of map coordinates to fixed digits
        lng: this.map.getCenter().lng.toFixed(4),
        lat: this.map.getCenter().lat.toFixed(4),

        // Determine map zoom level to fixed digits
        zoom: this.map.getZoom().toFixed(2)
      });
    });
  }

  onLoadMap = () => {
    this.map.on('load', () => {
      this.onLoadImage();
      this.onMouseEnterMapPin();
      this.onAddSource();  
    });
  }

  onAddSource = () => {
    this.setState({ sourceName: 'exposureData' });
    this.map.addSource('exposureData', {
      'type': 'geojson',
      'data': sampleBatchMap
    })

    // this.map.addSource('exposureData', {
    //   'type': 'geojson',
    //   'data': {
    //     "type":"FeatureCollection",
    //     "features":[
    //       {
    //         "type":"Feature",
    //         "properties": {
    //            "AddressLine":"1600 Pennsylvania Ave NW, Washington, DC 20500",
    //            "icon": "blueIcon"
    //         },
    //         "geometry":{
    //            "type":"Point",
    //            "coordinates": [
    //               -77.036514,
    //               38.897959
    //            ]
    //         }
    //      },
    //      {
    //       "type":"Feature",
    //       "properties": {
    //          "AddressLine":"160 Pennsylvania Ave NW, Washington, DC 20500",
    //          "icon": "blueIcon"
    //       },
    //       "geometry":{
    //          "type":"Point",
    //          "coordinates": [
    //             -77.036514,
    //             38.897939
    //          ]
    //       }
    //       }
    //     ]
    //   }
    // });

  };

  onAddLayer = (layerId) => {
    // this.map.addLayer({
    //   'id': layerId,
    //   'type': 'circle',
    //   // source name must match `sourceName provided .addSource()
    //   'source': this.state.sourceName,
    //   'paint': {
    //     // make circles larger as the user zooms from z12 to z22
    //     'circle-radius': {
    //       'base': 1.75,
    //       'stops': [[12, 2], [22, 180]]
    //     },
    //     // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
    //     'circle-color': [
    //       'match', ['get', 'id'],
    //       'coordinates', '#fbb03b',
    //       'falseCoordinates', '#223b53'
    //     ]
    //   }
    // })

    this.map.addLayer({
      'id': layerId,
      'type': 'symbol',
      // source must match `sourceName` provide on .addSource()
      'source': this.state.sourceName,
      'layout': {
        // icon-image must match name given to .loadImage()
        'icon-image': 'blueIcon',
        // 'icon-size': 0.15,
        'icon-size': 0.02,
        'icon-allow-overlap': true
      },
    })
  }

  onLoadImage = () => {
    // let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';

    let blueIcon = 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/262-512.png';
    let redIcon = 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-6/177800/263-512.png';
    
    this.map.loadImage(blueIcon, (error, image) => {
      if (error) throw error;
      
      // 1st argument must mactch name given to .loadImage()
      this.map.addImage('blueIcon', image);
      this.onAddLayer('coordinates');
    });

    this.map.loadImage(redIcon, (error, image) => {
      if (error) throw error;

      this.map.addImage('redIcon', image);
      this.onAddLayer('coordinates');
    });
  }

  onMouseEnterMapPin = () => {
    // 2nd argument must match layerId- given to .addLayer()
    this.map.on('mouseenter', 'coordinates', (e) => {
      // Change the cursor style
      this.map.getCanvas().style.cursor = 'pointer';
       
      let coordinates = e.features[0].geometry.coordinates;
      let addressLine = e.features[0].properties.AddressLine;
      let content = `<strong>${addressLine}</strong>
      <p>${coordinates[1]}, ${coordinates[0]}</p>`;

      // On map zooms out, ensure multiple copies of the feature are visible
      // The popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] 
        ? 360 : -360;
      }
       
      // Populate the popup and set its coordinates from feature
      this.popup
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(this.map);
    });

    this.map.on('mouseleave', 'coordinates', () => {
      this.map.getCanvas().style.cursor = '';
      this.popup.remove();
    });
  }
      
  render() {
    return (
      <div className='App'>
        <div className='sidebarStyle'>
          Longitude: {this.state.lng} | 
          Latitude: {this.state.lat} | 
          Zoom: {this.state.zoom}
        </div>      
        <div 
          ref={el => this.mapContainer = el} 
          className='mapContainer'/>
      </div>
    )
  }
}

export default App;
