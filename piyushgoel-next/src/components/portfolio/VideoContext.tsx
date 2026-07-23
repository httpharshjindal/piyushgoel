"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface VideoContextValue {
  isVideoPlaying: boolean;
  setVideoPlaying: (playing: boolean) => void;
}

const VideoContext = createContext<VideoContextValue>({
  isVideoPlaying: false,
  setVideoPlaying: () => {},
});

export function VideoProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const isVideoPlaying = count > 0;

  const setVideoPlaying = useCallback((playing: boolean) => {
    setCount((c) => c + (playing ? 1 : -1));
  }, []);

  return (
    <VideoContext.Provider value={{ isVideoPlaying, setVideoPlaying }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoState() {
  return useContext(VideoContext);
}
