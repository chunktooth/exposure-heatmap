import React from 'react';
import mapboxgl from 'mapbox-gl';
import sampleBatchMap from './exposureData/sampleBatchMap.geojson';
import './App.scss';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        lng: 5.3753,
        lat: 29.6213,
        zoom: 1.49
      };
    }

  componentDidMount() {
    this.configureMapbox();
    this.storeCoordinates();
    this.onMapLoad();
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

  onMapLoad = () => {
    this.map.on('load', () => {
      this.loadMapPin()
      this.onMouseEnterMapPin()
    });
  }

  // Layer only valid with id 'point'
  addLayer = (idName) => {
    this.map.addLayer({
      'id': idName,
      'type': 'symbol',
      'source': 'point',
      'layout': {
        'icon-image': 'pug',
        'icon-size': 0.15,
        'icon-allow-overlap': true
      },
    })
  }

  // Source only valid with id 'point'
  addSource = (idName) => {
    this.map.addSource(idName, {
      'type': 'geojson',
      'data': sampleBatchMap
    })
  };

  loadMapPin = () => {
    let imagePath = 'https://cdn.iconscout.com/icon/premium/png-256-thumb/pug-563422.png';
    
    this.map.loadImage(imagePath, (error, image) => {
      if (error) throw error;
      
      this.map.addImage('pug', image);
      this.addSource('point');  
      this.addLayer('point');
    })
  }

  onMouseEnterMapPin = () => {
    this.map.on('mouseenter', 'point', (e) => {

      // Change the cursor style
      this.map.getCanvas().style.cursor = 'pointer';
       
      let coordinates = e.features[0].geometry.coordinates.slice();
      let addressLine = e.features[0].properties.AddressLine;
      let content = `<p>${addressLine}</p><strong>${coordinates}</strong>`;

      // Ensure that if the map is zoomed out such that multiple
      // Copies of the feature are visible, the popup appears
      // Over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
       
      // Populate the popup and set its coordinates from feature
      this.popup
        .setLngLat(coordinates)
        .setHTML(content)
        .addTo(this.map);
    });

    this.map.on('mouseleave', 'point', () => {
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
