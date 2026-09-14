import { useState, useEffect, useCallback } from 'react';

export function useRefreshData(onRefreshCallback) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(Date.now());
  const [timeAgoText, setTimeAgoText] = useState('just now');
  const [refreshCount, setRefreshCount] = useState(0);

  // Update relative time display every 10 seconds
  useEffect(() => {
    const updateRelativeTime = () => {
      const elapsedSeconds = Math.floor((Date.now() - lastUpdatedTimestamp) / 1000);
      if (elapsedSeconds < 30) {
        setTimeAgoText('just now');
      } else if (elapsedSeconds < 60) {
        setTimeAgoText(`${elapsedSeconds}s ago`);
      } else {
        const mins = Math.floor(elapsedSeconds / 60);
        setTimeAgoText(`${mins}m ago`);
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 10000);
    return () => clearInterval(interval);
  }, [lastUpdatedTimestamp]);

  const triggerRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    // Simulate subtle network latency & data re-calc
    setTimeout(() => {
      setLastUpdatedTimestamp(Date.now());
      setTimeAgoText('just now');
      setRefreshCount((c) => c + 1);
      setIsRefreshing(false);
      if (onRefreshCallback) {
        onRefreshCallback();
      }
    }, 600);
  }, [isRefreshing, onRefreshCallback]);

  return {
    isRefreshing,
    timeAgoText,
    lastUpdatedTimestamp,
    refreshCount,
    triggerRefresh,
  };
}
