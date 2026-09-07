import { useEffect, useState } from 'react';

export interface SoundEvent {
  eventType: string;
  level: number;
  ts: number;
}

export function useAcousticSocket(host: string, port: string) {
  const [connected, setConnected] = useState(false);
  const [level, setLevel] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState<SoundEvent | null>(null);

  useEffect(() => {
    if (!host) return;

    const ws = new WebSocket(`ws://${host}:${port}`);

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'hello', role: 'app' }));
    };

    ws.onmessage = (message) => {
      const msg = JSON.parse(message.data);
      if (msg.type === 'telemetry') {
        setLevel(msg.level);
      } else if (msg.type === 'event') {
        setLastEvent(msg);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [host, port]);

  return { connected, level, lastEvent };
}