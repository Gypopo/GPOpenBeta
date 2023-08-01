import {Beta} from './Beta.js';

export class API {

    /**
    * @param {string} pl
    * @returns {Promise<Array<Beta>>}.
    */
    async loadVersions(pl) {
      
        var response = await this.fetchWithTimeout("http://192.168.55.170:3333/api/getBetaVersions?plugin=" + pl, {
            method: 'GET',
            timeout: 15000
          });

        var raw = await response.text();
        var values = JSON.parse(raw);
        var list = values.map(function(x) {
          return new Beta(x.version, x.changelog, x.releaseDate);
        })
      
        return list;
    }

    /**
* @param {Beta} beta
* @param {string} pl
*/
    async downloadBeta(pl, beta) {
      try {
      var response = await this.fetchWithTimeout("http://192.168.55.170:3333/api/download?plugin=" + pl + "&version=" + beta.getVersion(), {
            method: 'GET',
            timeout: 15000,
            resolveWithFullResponse: true
          });

          if (response.status === 200) {
          var blob = await response.blob();
          //var raw = await response.text();
          //var bytes = this.base64ToArrayBuffer(raw);
          var element = document.createElement('a');
        
          element.style.display = 'none';

            var url = window.URL.createObjectURL(/*new Blob([bytes], {type: "octet/stream"})*/blob);
            element.href = url;
            element.download = (pl === 'esgui' ? "EconomyShopGUI-v" : "EconomyShopGUI-Premium-v") + beta.getVersion() + ".jar";
            element.click();
            window.URL.revokeObjectURL(url);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          }

          var self = this;
          setTimeout(function() {
        
            self.completeDownload(response.status);
          }, 5000);
        } catch (e) {
          var self = this;
          console.log(e);
          setTimeout(function() {
            self.completeDownload(503);
          }, 5000);
        }
    }

    /*** 
     * @param {number} status
    */
    completeDownload(status) {
      var e = document.getElementById('confirm content-small');
      
      if (status == '200') {
      e.innerHTML = '<div class="wrapper"><svg class="animated-check" viewBox="0 0 24 24"><path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none"></path></svg></div>Redirecting...';

      setTimeout(function() {
        window.location.href = window.location.href.replace('.html', '') + '/thank-you.html'},
        2000);
      } else {
        e.innerHTML = '<p style="font-size:25px;position:absolute;margin:0;" class="wrapper">❌</p><b style="bottom:12px;right:35px;font-size:15px;margin:0;position:absolute;">Error ' + status + "</b>";
      }
    }

    base64ToArrayBuffer(base64) {
      var binaryString =  window.atob(base64);
      var binaryLen = binaryString.length;
      var bytes = new Uint8Array(binaryLen);
      for (var i = 0; i < binaryLen; i++)        {
          var ascii = binaryString.charCodeAt(i);
          bytes[i] = ascii;
      }
      return bytes;
    }
      

    /**
* @param {Beta} beta
* @param {string} pl
*/
    async verifyAsync(pl, beta) {
      var loader = document.createElement('div');
      loader.className = 'verify-loader';

      this.click("http://192.168.55.170:3333/api/authorize?plugin=" + pl + "&version=" + beta.getVersion());
    }

    click(link) {
          var element = document.createElement('a');
          element.href = link;
        
          element.style.display = 'none';
          document.body.appendChild(element);
        
          element.click();
        
          document.body.removeChild(element);
    }

    async check(o, pl, ver) {
      var response = await fetch("http://192.168.55.170:3333/api/check?token=" + o, {
            method: 'GET'
          });
      var raw = await response.text();
      console.log(raw);

      if (raw === 'true') {
        var response = await this.fetchWithTimeout("http://192.168.55.170:3333/api/download?plugin=" + pl + "&version=" + ver + "&token=" + o, {
            method: 'GET',
            timeout: 15000
          });
      } else 
        setTimeout(check(o), 5000);
    }

    saveFile() {

    }

    /**
    * @returns {Promise<Response>}
    */
    async fetchWithTimeout(resource, options = {}) {
        var { timeout = 8000 } = options;
        
        var controller = new AbortController();
        var id = setTimeout(() => controller.abort(), timeout);
        var response = await fetch(resource, {
          ...options,
          signal: controller.signal  
        });
        clearTimeout(id);

        return response;
    }
}