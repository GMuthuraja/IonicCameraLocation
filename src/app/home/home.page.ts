import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

interface CameraDetail {
  filename: string;
  json_metadata: string;
}

interface CameraExifDetail {
  aperture: string;
  datetime: string;
  exposureTime: string;
  flash: string;
  focalLength: string;
  gpsAltitude: string;
  gpsAltitudeRef: string;
  gpsDateStamp: string;
  gpsLatitude: string;
  gpsLatitudeRef: string;
  gpsLongitude: string;
  gpsLongitudeRef: string;
  gpsProcessingMethod: string;
  gpsTimestamp: string;
  iso: string;
  make: string;
  model: string;
  orientation: string;
  whiteBalance: string;
}

interface Output {
  base64: string;
  exifDetail: CameraExifDetail;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  images: Output[] = [];
  registeredLat: any;
  registeredLon: any;
  currentLat: any;
  currentLon: any;
  radius: any
  geolocationError: any;

  constructor(
    private camera: Camera,
    private geolocation: Geolocation) { }

  fetchMyLocation() {
    this.geolocation.getCurrentPosition().then(data => {
      this.registeredLat = data.coords.latitude;
      this.registeredLon = data.coords.longitude;
    }, err => {
      this.geolocationError = err;
    });
  }

  takePicture() {
    this.images = [];
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData: string) => {
      const cameraDetail = <CameraDetail>JSON.parse(imageData);
      const exifData = <CameraExifDetail>JSON.parse(cameraDetail.json_metadata);
      const output: Output = {
        base64: `data:image/jpeg;base64,${cameraDetail.filename}`,
        exifDetail: exifData
      };

      console.log(exifData);
      this.images.unshift(output);

      this.currentLat = this.ConvertDMSToDD(exifData.gpsLatitude, exifData.gpsLatitudeRef);
      this.currentLon = this.ConvertDMSToDD(exifData.gpsLongitude, exifData.gpsLongitudeRef);
      this.radius = this.distance(this.currentLat, this.currentLon, this.registeredLat, this.registeredLon);
      //this.radius = this.distance(8.5410453, 77.7643142, 8.5410453, 77.7643142);

      if (this.radius < 50) {
        alert("You are bound to 50mtrs");
      } else {
        alert("You are out of bound to 50mtrs");
      }
    }, (err) => {
      console.log(err);
    });
  }

  ConvertDMSToDD(latlong, direction) {
    if (latlong) {
      let splitted = latlong.split(',');
      console.log(splitted);

      let degrees = eval(splitted[0]);
      let minutes = eval(splitted[1]);
      let seconds = eval(splitted[2]);
      console.log(degrees + " " + minutes + " " + seconds);

      var dms = (degrees) + ((minutes) / 60) + ((seconds) / 3600);
      if (direction == "S" || direction == "W") {
        dms = dms * -1;
      }
      return dms;
    }
  }

  truncate(num, places) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

  distance(p_lat1, p_lon1, p_lat2, p_lon2) {
    //Convert the latitudes and longitudes from degree to radians. 
    let lat1 = this.toRadians(p_lat1);
    let long1 = this.toRadians(p_lon1);
    let lat2 = this.toRadians(p_lat2);
    let long2 = this.toRadians(p_lon2);

    // Haversine Formula 
    let dlong = long2 - long1;
    let dlat = lat2 - lat1;

    let ans = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlong / 2), 2);
    ans = 2 * Math.asin(Math.sqrt(ans));

    // Radius of Earth in 
    // Kilometers, R = 6371 
    // Use R = 3956 for miles 
    let R = 6371;
    // Calculate the result 
    ans = ans * R;
    return this.truncate(ans * 1000, 2); //in mtr
  }

  toRadians(degree) {
    let one_deg = (Math.PI) / 180;
    return (one_deg * degree);
  }
}
