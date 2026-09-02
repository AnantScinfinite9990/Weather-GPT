const fs = require('fs');
let code = fs.readFileSync('backend/server.ts', 'utf8');

const original = `        if (liveData.hourly) {
          base.hourly = liveData.hourly.time.slice(0, 24).map((t: string, i: number) => ({
            time: t.split('T')[1].substring(0, 5),
            temp: Math.round(liveData.hourly.temperature_2m[i] * 10) / 10,
            rainProb: liveData.hourly.precipitation_probability[i],
            windSpeed: Math.round(liveData.hourly.wind_speed_10m[i]),
            condition: liveData.hourly.precipitation_probability[i] > 60 ? 'Thunderstorm' : 
                       liveData.hourly.precipitation_probability[i] > 30 ? 'Rain Showers' : 'Partly Cloudy'
          }));
        }`;

const replacement = `        if (liveData.hourly && liveData.current) {
          const currentHourStr = liveData.current.time.substring(0, 13) + ":00";
          let startIndex = liveData.hourly.time.indexOf(currentHourStr);
          if (startIndex === -1) startIndex = 0;

          base.hourly = [];
          for (let i = startIndex; i < startIndex + 24 && i < liveData.hourly.time.length; i++) {
            base.hourly.push({
              time: liveData.hourly.time[i].split('T')[1].substring(0, 5),
              temp: Math.round(liveData.hourly.temperature_2m[i] * 10) / 10,
              rainProb: liveData.hourly.precipitation_probability[i] || 0,
              windSpeed: Math.round(liveData.hourly.wind_speed_10m[i] || 0),
              condition: (liveData.hourly.precipitation_probability[i] > 60) ? 'Thunderstorm' : 
                         (liveData.hourly.precipitation_probability[i] > 30) ? 'Rain Showers' : 'Partly Cloudy'
            });
          }
        }`;

code = code.replace(original, replacement);
fs.writeFileSync('backend/server.ts', code);
