// pusherService.ts
import Pusher from 'pusher-js';

const pusher = new Pusher('b8c7db949ba052d945a4', {
  cluster: 'ap2',
});

export const subscribeToChannel = (
  channelName: string,
  eventName: string,
  callback: (data: any) => void
) => {
  const channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
};

export const triggerEvent = (channelName: string, eventName: string, data: any) => {
  const channel = pusher.subscribe(channelName);
  channel.trigger(eventName, data);
};