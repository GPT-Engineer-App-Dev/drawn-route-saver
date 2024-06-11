import React, { useEffect, useRef, useState } from 'react';
import { Container } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import 'leaflet-draw';

const center = [59.3706, 18.6984];

const MapComponent = () => {
  const map = useMap();
  const [route, setRoute] = useState([]);
  const routeRef = useRef(route);
  routeRef.current = route;

  useEffect(() => {
    const savedRoute = localStorage.getItem('kayakingRoute');
    if (savedRoute) {
      setRoute(JSON.parse(savedRoute));
    }

    const drawControl = new L.Control.Draw({
      draw: {
        polyline: true,
        polygon: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
      const newRoute = [...routeRef.current, ...layer.getLatLngs()];
      setRoute(newRoute);
      localStorage.setItem('kayakingRoute', JSON.stringify(newRoute));
    });

    map.on('draw:created', function (event) {
      const layer = event.layer;
      const length = L.GeometryUtil.length(layer.getLatLngs());
      alert(`Route length: ${(length / 1000).toFixed(2)} km`);
    });

    return () => {
      map.removeControl(drawControl);
    };
  }, [map]);

  return (
    <>
      <Marker position={center}></Marker>
      <Polyline positions={route} color="blue" />
    </>
  );
};

const Index = () => {
  return (
    <Container maxW="full" height="100vh" padding="0">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapComponent />
      </MapContainer>
    </Container>
  );
};

export default Index;