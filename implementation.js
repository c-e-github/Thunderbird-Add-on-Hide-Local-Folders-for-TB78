var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

var myapi = class extends ExtensionCommon.ExtensionAPI {
   getAPI(context) {
      let self = this;

      return {
         myapi: {
            async hidelocalfolder() {
               self.recentWindow = Services.wm.getMostRecentWindow("mail:3pane");
               if (self.recentWindow) {
                  self.recentWindow.hideLocalFolderBackup = self.recentWindow.gFolderTreeView._rebuild;
                  self.recentWindow.gFolderTreeView._rebuild = function(){
                     self.recentWindow.hideLocalFolderBackup.call(self.recentWindow.gFolderTreeView);
                     cleanTree();
                  };
                  self.recentWindow.gFolderTreeView._rebuild();

                  function cleanTree() {
                     for(let i = self.recentWindow.gFolderTreeView._rowMap.length -1; i >= 0 ; i--){
                        if(self.recentWindow.gFolderTreeView._rowMap[i]._folder.hostname == 'Local Folders'){
                           self.recentWindow.gFolderTreeView._rowMap.splice(i, 1);
                           self.recentWindow.gFolderTreeView._tree.rowCountChanged(i, -1);
                        }
                     }
                  }
               }
            },
         },
      };
   }
//------------------------------------------------------------------------------------
   onShutdown(isAppShutdown) {
      // This is called when the add-on or Thunderbird itself is shutting down
      if (isAppShutdown) {
         return;
      }
      this.recentWindow.gFolderTreeView._rebuild = this.recentWindow.hideLocalFolderBackup;
      this.recentWindow.gFolderTreeView._rebuild();
      Services.obs.notifyObservers(null, "startupcache-invalidate", null);
   }
//------------------------------------------------------------------------------------
};
