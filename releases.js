// Example from: https://docs.microsoft.com/en-us/azure/devops/extend/develop/ui-controls/configure?view=azure-devops
VSS.init({
    explicitNotifyLoaded: true,
    usePlatformScripts: true,
    usePlatformStyles: true       
});


// Example from: https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops#data-collections-of-documents-storage
VSS.getService(VSS.ServiceIds.ExtensionData).then(function(dataService) {
    var context = VSS.getWebContext();

    // Old style Q promises (as used by VSS SDK): https://github.com/kriskowal/q/wiki/API-Reference#core-promise-methods
    dataService
        .getDocument("Releases", context.project.name)
        .then(function(doc) { 
            new Vue({
                el: '#app',
                data: {
                    reports: doc.reports.sort(function(a, b) { return a.release.localeCompare(b.release); })
                },
                filters: {
                    moment: function(date) {
                        return moment(date).fromNow();
                    }
                }
            });
        }, function(err) { document.getElementById("error").innerText = err.message; })
        .then(function(){ VSS.notifyLoadSucceeded(); });
});