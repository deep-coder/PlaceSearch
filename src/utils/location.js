export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    let pos = {};
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        pos.latitude = position.coords.latitude;
        pos.longitude = position.coords.longitude;
        resolve(pos);
      });
    } else {
      reject("Not Supported by browser");
    }
  });
}
