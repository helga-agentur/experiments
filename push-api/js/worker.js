
console.log('worker working');

self.addEventListener('push', function(event) {
    if (event.data) {
        console.log('This push event has data: ', event.data.text());
        self.registration.showNotification(event.data.text());
    } else {
        console.log('This push event has no data.');
    }
  });