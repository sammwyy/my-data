const container = document.getElementById("sections");

const sections = [
  {
    title: "Browser",
    content: {
      Name: platform.name,
      Version: platform.version,
      Layout: platform.layout,
      Language: navigator.language,
      Cookies: navigator.cookieEnabled,
      "Do Not Track": navigator.doNotTrack,
      Plugins: navigator.plugins?.length,
    },
  },
];

function createSectionContentObject(content) {
  return Object.keys(content)
    .map((key) => {
      return `<div class="section-item">
            <div class="section-key">${key}</div>
            <div class="section-value">${content[key]}</div>
          </div>`;
    })
    .join("\n");
}

function createSectionDOMObject(section) {
  return `
    <div class="section">
        <div class="section-body">
            <div class="section-title">${section.title}</div>
            <div class="section-content">${createSectionContentObject(
              section.content
            )}</div>
        </div>
    </div>
  `;
}

async function showDevice() {
  sections.push({
    title: "Device",
    content: {
      Manufacturer: platform.manufacturer,
      Product: platform.product,
      OS: platform.os,
      "Screen size": window.screen.width + "x" + window.screen.height,
      Downlink: navigator.connection.downlink,
      "Effective Type": navigator.connection.effectiveType,
      "Connection Type": navigator.connection.type,
    },
  });
}

async function showGEO() {
  let error = null;
  const req = await fetch("http://ip-api.com/json/?fields=61439").catch((e) => {
    console.error(e);
    error = e.message;
    return null;
  });

  const res = req ? await req.json() : null;

  if (res) {
    sections.push({
      title: "Geo",
      content: {
        Country: res.country,
        Region: res.regionName,
        City: res.city,
        Zip: res.zip,
        Coordinates: "Lat: " + res.lat + ", Lon: " + res.lon,
        ISP: res.isp,
        IP: res.query,
      },
    });
  } else {
    sections.push({
      title: "Geo",
      content: {
        error: "Cannot fetch for Geo data.",
        message: error,
      },
    });
  }
}

async function start() {
  await showDevice();
  await showGEO();

  for (const section of sections) {
    container.innerHTML += createSectionDOMObject(section);
  }
}

start();