var { ExtensionCommon } = ChromeUtils.import("resource://gre/modules/ExtensionCommon.jsm");
var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
var recentWindow;
var org;

var myapi = class extends ExtensionCommon.ExtensionAPI {
   getAPI(context) {
      return {
         myapi: {
            async hidelocalfolder() {
               recentWindow = Services.wm.getMostRecentWindow("mail:3pane");
               if (recentWindow) {
                  let f = recentWindow.gFolderTreeView._rebuild;
                  org = recentWindow.gFolderTreeView._rebuild;
                  recentWindow.gFolderTreeView._rebuild = function(){
                     f.call(recentWindow.gFolderTreeView);
                     cleanTree();
                  };
                  recentWindow.gFolderTreeView._rebuild();

                  function cleanTree() {
                     for(let i = recentWindow.gFolderTreeView._rowMap.length -1; i >= 0 ; i--){
                        if(recentWindow.gFolderTreeView._rowMap[i]._folder.hostname == 'Local Folders'){
                           recentWindow.gFolderTreeView._rowMap.splice(i, 1);
                           recentWindow.gFolderTreeView._tree.rowCountChanged(i, -1);
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
    if (isAppShutdown) {
      return;
    }
    recentWindow.gFolderTreeView._rebuild = function(){
       org.call(recentWindow.gFolderTreeView);
    };
    recentWindow.gFolderTreeView._rebuild();
    Services.obs.notifyObservers(null, "startupcache-invalidate", null);
  }
//------------------------------------------------------------------------------------
};