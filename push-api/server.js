const webpush = require('web-push');

const vapidKeys = {
    publicKey:
  'BHr6YUMuHgYYfTivE4dg8Lk0yO_yFpg8nA44CWdHK-vMAwfMDa90osqGQNgot7mHZWdKVNjp_gz7zsez_cnRcnA',
    privateKey: 'pN1bMjARG-mdYTFqhNRu0VOJwrz_XYcV2SZWCABXAg4'
  };
  
  webpush.setVapidDetails(
    'mailto:felix@joinbox.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  

const endpoint = 'https://fcm.googleapis.com/fcm/send/dYMmHGFdwBs:APA91bEEouvGpKdZgpEKf1XUCKwG3krzxVlxsOsulQLb6vxKIJNgOKleWEGuyvvL7Bm2n_HBIk77JaofWzm2pr7NOA0xXRXOL0yltefyLjGM6hY2OgNPWqU56Fl1xgbbiMxMwJxSlsTW';
const pushSubscription = {
    endpoint,
    keys: {
        auth: 'wXJgDgEVSdaQoWG64Aoe6w',
        p256dh: 'BAbqqxc0v7n211KlNv-7pY4cI5__vY50bt3cVyzd-lskKC_dM3TWG9k1-iBZJN5nLSnDOB0FuMqKbvntA2pGNds',
    }
};

webpush.sendNotification(pushSubscription, 'säli sändu')
    .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
            console.log('Subscription has expired or is no longer valid: ', err);
            return deleteSubscriptionFromDatabase(subscription._id);
        } else {
            throw err;
        }
    });
