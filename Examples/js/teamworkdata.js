(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "taskname",
            alias: "taskname",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "duedate",
            alias: "due date",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "assignee",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "tasklist",
            alias: "Tasks from Teamwork",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://smartflow.teamwork.com/tasks.json", function(resp) {
            var feat = resp["todo-items"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "id": feat[i].id,
                    "taskname": feat[i].description,
                    "duedate": feat[i]["due-date"],
                    "assignee": feat[i]["responsible-party-ids"]
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Teamwork Tasks"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
