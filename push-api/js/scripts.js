import urlBase64ToUint8Array from './urlBase64ToUint8array.js'; 
/* global window */ 

const setupServiceWorker = async() => {
    
    let resolve;
    const promise = new Promise((resolveFn, rejectFn) => {
        resolve = resolveFn;
    });

    window.addEventListener('load', async() => {
        const registration = await navigator.serviceWorker.register('./js/worker.js');
        console.log('worker registered', registration);
        resolve(registration);
    });

    return promise;
}


const subscribe = async(worker) => {
    const options = {
        // See https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array('BHr6YUMuHgYYfTivE4dg8Lk0yO_yFpg8nA44CWdHK-vMAwfMDa90osqGQNgot7mHZWdKVNjp_gz7zsez_cnRcnA'),
    };
    const pushSubscription = await worker.pushManager.subscribe(options);
    console.log(pushSubscription);
    return pushSubscription;
}


const getNotificationPermissions = async () => {
    // Should happen on unser interaction
    const permissionResult = await Notification.requestPermission();
    console.log('permissions', permissionResult);
    if (permissionResult !== 'granted') return false;
    return true;
}

const showNotification = (worker) => {
    worker.showNotification('title', {
        body: 'body',
        actions: [{
            action: 'yes', title: 'Yes'
        }]
    });    
}


const worker = await setupServiceWorker();
// showNotification(worker);
// const permissions = await getNotificationPermissions();
// const subscription = await subscribe(worker);
// console.log(JSON.stringify(subscription));