import {API} from './api.js';
import {Beta} from './Beta.js';

var api = new API();
var esgui;
var esgui_prem;

init();

function init() {
    var activeTab = document.getElementById("version-tab active")
    activeTab.onclick = function() {changeTab(false);}
    var tab = document.getElementById("version-tab")
    tab.onclick = function() {changeTab(true);}
    
    loadVersions(false);
}

/**
 * Load veasions async
 * @param {boolean} prem
 */
async function loadVersions(prem) {
    displayLoader();
    var c = prem ? "esgui_prem" : "esgui";

    try {
      api.loadVersions(c).then(v => {
          if (prem) {
              esgui_prem = v;
          } else {
              esgui = v;
          }
          openTab(prem);
      });
    } catch(e) {
      if (e.name === 'AbortError') {
          alert('A timeout exception occured while trying to reach the backend server, please report this issue to: https://discord.com/invite/nPyuB4F');
      } else {
          alert('It looks like there was an error while trying to load this page, please report this to our discord at: https://discord.com/invite/nPyuB4F');
      }
      console.log(e);
    }
}

function displayLoader() {
  const versionsContainer = document.getElementById('versionsContainer');

  versionsContainer.innerHTML = `<div class="loader"></div>`;
}

// Change the tab in sync
function changeTab(prem) {
    const esguiTab = document.querySelector('.version-tab:nth-child(1)');
    const esguiPremTab = document.querySelector('.version-tab:nth-child(2)');

    if (prem) {
        esguiTab.classList.remove('active');
        esguiPremTab.classList.add('active');

        if (typeof esgui_prem === 'undefined') {
            loadVersions(prem);
        } else {
            openTab(prem);
        }
    } else {
        esguiTab.classList.add('active');
        esguiPremTab.classList.remove('active');

        if (typeof esgui === 'undefined') {
            loadVersions(prem);
        } else {
            openTab(prem);
        }
    }
}

/**
 * Display tab contents
 * @param {boolean} prem
 */
function openTab(prem) {
    const versionsContainer = document.getElementById('versionsContainer');
    versionsContainer.innerHTML = ''; // Remove async loader

    if (prem) {
        for (var ver of esgui_prem) {
            versionsContainer.appendChild(getVersionTile(ver, "esgui_prem"))
        }
    } else {
        for (var ver of esgui) {
            versionsContainer.appendChild(getVersionTile(ver, "esgui"))
        }
    }
  }

/**
* @param {Beta} beta
* @param {string} pl
* @returns {HTMLElement}
*/
function getVersionTile(beta, pl) {
    var tile = document.createElement('div');
    tile.className = "version-card " + pl + "-version";
    //tile.onclick = function() {downloadAsync(beta, pl);}
    tile.title = beta.version;

    // Version number
    var vd = document.createElement('div');
    var vn = document.createElement('span');
    vn.className = 'version-details';
    vn.innerHTML = 'v' + beta.version;
    vd.appendChild(vn);
    tile.appendChild(vd);

    // Download button
    
      var db = document.createElement('div');
      db.innerHTML = 'Download';
      db.addEventListener('click', function() {
        //history.pushState(null, null, window.location.href + "?ver=" + beta.getVersion());
        downloadAsync(beta, pl);
      });
      db.className = 'version-download';
      db.style.fontFamily = 'Caprasimo';
      tile.appendChild(db);
    
    
    if (pl === 'esgui_prem') {
      
    }

    // Release date
    var rd = document.createElement('span');
    rd.className = 'release-date';
    rd.innerHTML = 'Release date: ' + beta.releaseDate;
    tile.appendChild(rd);

    // Version arror
    var va = document.createElement('div');
    va.className = "version-arrow";
    va.innerHTML = '&#xbb;';
    tile.appendChild(va);

    // Changelog
    var cl = document.createElement('div');
    cl.className = "changelog";
    cl.innerHTML = beta.changelog;
    /*
    var log = document.createElement(ul);
    for (var change of beta.changelog.split("\n")) {
        var entry = document.createElement('li')
    }
    */
    tile.appendChild(cl);

    return tile;
}

/**
* @param {Beta} beta
* @param {string} pl
*/
function downloadAsync(beta, pl) {
    if (pl === 'esgui_prem') {
        var overlay = document.createElement('div');
        overlay.className = 'confirm';
        overlay.onclick = closeListener;
        overlay.id = 'confirm';
    
        var content = document.createElement('div');
        content.className = 'confirm content';
    
        var container = document.createElement('div');
        container.className = 'confirm box';
        
        var description = document.createElement('div');
        description.innerHTML = '<b>Validation thru discord required.</b><br>' + 
        '<a style="font-size: smaller;">See our </a><a href="https://discord.com/channels/555732704310853682/836291104059817994" target="_blank" style="color:blue;font-size:smaller;font-weight:bold;">#verify-resource</a><a style="font-size: smaller;"> channel to validate.</a>';
        description.className = 'confirm description';

        var button = document.createElement('div');
        button.className = 'validate-button';
        button.innerHTML = '<span>Validate</span>';
        button.onclick = function() {api.verifyAsync(pl, beta);}

        container.appendChild(button);
        container.appendChild(description);
        content.appendChild(container);

        overlay.appendChild(content);

        document.body.appendChild(overlay);
    } else {
        var overlay = document.createElement('div');
        overlay.className = 'confirm';
        overlay.id = 'confirm';
    
        var content = document.createElement('div');
        content.className = 'confirm content-small';
        content.id = 'confirm content-small';
        content.innerHTML = '<div class="download-loader"></div>Downloading...';

        overlay.appendChild(content);

        document.body.appendChild(overlay);

        console.log(pl);
        api.downloadBeta(pl, beta)
    }
}

function closeListener(e) {
  var overlay = document.getElementById('confirm');
  
  if (e.target == overlay) {
      document.body.removeChild(overlay);
      history.pushState(null, null, window.location.pathname);
  }
}

/**
* @returns {HTMLElement}
*/
function startDownloadLoading() {
    var loaderFrame = document.createElement('div');
    loaderFrame.className = 'loader-frame';
    loaderFrame.id = 'loader';

    var loader = document.createElement('div');
    loader.className = 'loader';

    loaderFrame.appendChild(loader);
    return loaderFrame;
}

/**
* 
* @returns {string}
*/
function getESGUIPremCardTile() {
    return `
    <div class="version-card esgui-prem-version">
      <div class="version-details">
        <span class="version-number">Version 2.0.0</span>
      </div>
      <span class="release-date">Released on August 1, 2023</span>
      <div class="version-arrow">→</div>
      <div class="changelog">
        <p>Changelog for Version 2.0.0:</p>
        <ul>
          <li>Added new feature A</li>
          <li>Improved user interface</li>
        </ul>
      </div>
    </div>
    <div class="version-card esgui-prem-version">
      <div class="version-details">
        <span class="version-number">Version 1.5.0</span>
      </div>
      <span class="release-date">Released on July 20, 2023</span>
      <div class="version-arrow">→</div>
      <div class="changelog">
        <p>Changelog for Version 1.5.0:</p>
        <ul>
          <li>Improved performance</li>
          <li>Fixed bug D</li>
        </ul>
      </div>
    </div>
  `;
}

/**
* 
* @returns {string}
*/
function getESGUICardTile() {
    return `
          <div class="version-card esgui-version">
            <div class="version-details">
              <span class="version-number">Version 1.0.0</span>
              <span class="beta-badge">Beta</span>
            </div>
            <span class="release-date">Released on July 15, 2023</span>
            <div class="version-arrow">→</div>
            <div class="changelog">
              <p>Changelog for Version 1.0.0:</p>
              <ul>
                <li>Added new feature X</li>
                <li>Fixed bug Y</li>
                <li>Improved performance</li>
              </ul>
            </div>
          </div>
          <div class="version-card esgui-version">
            <div class="version-details">
              <span class="version-number">Version 0.9.0</span>
              <span class="beta-badge">Beta</span>
            </div>
            <span class="release-date">Released on June 30, 2023</span>
            <div class="version-arrow">→</div>
            <div class="changelog">
              <p>Changelog for Version 0.9.0:</p>
              <ul>
                <li>Added new feature B</li>
                <li>Fixed bug C</li>
              </ul>
            </div>
          </div>
        `;
}