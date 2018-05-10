/*jshint esversion: 6 */


export default function IndexController(container) {
    this._container = container;
    
    this._registerServiceWorker();
  }
  
  IndexController.prototype._registerServiceWorker = function() {
    if (!navigator.serviceWorker) return;
  
    var indexController = this;
  
    navigator.serviceWorker.register('/sw.js').then(function(reg) {
      if (!navigator.serviceWorker.controller) {
        return;
      }
  
      if (reg.waiting) {
        indexController._updateReady(reg.waiting);
        return;
      }
  
      if (reg.installing) {
        indexController._trackInstalling(reg.installing);
        return;
      }
  
      reg.addEventListener('updatefound', function() {
        indexController._trackInstalling(reg.installing);
      });
    });
  
    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  };
  
  IndexController.prototype._trackInstalling = function(worker) {
    var indexController = this;
    worker.addEventListener('statechange', function() {
      if (worker.state == 'installed') {
          console.log('installed');
      }
    });
  };