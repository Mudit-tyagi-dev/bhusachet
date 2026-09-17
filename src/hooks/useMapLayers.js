import { useState } from 'react';

export function useMapLayers() {
  const [layers, setLayers] = useState({
    heatmap: true,
    roads: true,
    weather: false,
    reports: true,
    boundaries: true,
  });

  const [activeRegion, setActiveRegion] = useState('all'); // 'all' | 'arunachal-pradesh' | 'assam' | 'manipur' | 'meghalaya' | 'mizoram' | 'nagaland' | 'sikkim' | 'tripura'
  const [selectedFeature, setSelectedFeature] = useState(null);

  const toggleLayer = (layerName) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  const setLayerActive = (layerName, isActive) => {
    setLayers((prev) => ({
      ...prev,
      [layerName]: isActive,
    }));
  };

  const resetLayers = () => {
    setLayers({
      heatmap: true,
      roads: true,
      weather: true,
      reports: true,
      boundaries: true,
    });
  };

  return {
    layers,
    toggleLayer,
    setLayerActive,
    resetLayers,
    activeRegion,
    setActiveRegion,
    selectedFeature,
    setSelectedFeature,
  };
}
