$(document).ready(function () {
    // Initialize DataTables for Occurrences Table
    const $occurrenceTable = $('#occurrence_table').DataTable({
        ajax: {
            url: '/get_occurrences',
            dataSrc: 'data'
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pageLength', // Add length menu option
                text: 'Rows per page'
            },
            {
                extend: 'searchBuilder',
                config: {
                    depthLimit: 2 // Limits nested conditions (optional)
                }
            },
            {
                extend: 'searchPanes',
                text: 'Filter Data',
                config: {
                    cascadePanes: true, // Automatically filters panes based on selection
                    dtOpts: {
                        dom: 'tp', // Only show table and paging
                        paging: true
                    }
                }
            },
            {
                extend: 'colvis',
                text: 'Show/Hide Columns'
            },
            {
                text: 'Deselect All',
                action: function (e, dt, node, config) {
                    dt.rows().deselect(); // Deselect all rows
                    updateSubmitButton(); // Reset submit button state
                }
            },
            {
                extend: 'csvHtml5',
                text: 'Export CSV'
            },
            {
                text: 'Fullscreen',
                action: function () {
                    toggleFullScreen('occurrences');
                }
            }         
        ],
        lengthMenu: [
            [10, 25, 50, -1], // Define page lengths: 10, 25, 50, or All
            [10, 25, 50, "All"] // Display text
        ],
        fixedHeader: true, // Enable fixed header
        select: { style: 'multi'},
        scrollX: true,
        fixedColumns: {
            leftColumns: 4 // Freezing the first 4 columns
        },
        columns: [
            { data: 'Comments' },
            { data: 'E2_Occurrence_ID' },
            { data: 'File_number' },
            {
                data: 'UTC_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            {
                data: 'Local_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            { data: 'State_area_of_occ' },
            { data: 'Location' },
            { data: 'Occurrence_class' },
            { data: 'Injury_Level' },
            { data: 'Highest_damage' },
            { data: 'Occurrence_Category' },
            { data: 'Aircraft_Registration' },
            { data: 'State_of_Registery' },
            { data: 'Operator_State' },
            { data: 'Operation_type_Level_1' },
            { data: 'Operation_type_Level_2' },
            { data: 'Operation_type_Level_3' },
            { data: 'Operator_Name' },
            { data: 'Aircraft_category_Level_1' },
            { data: 'Aircraft_category_Level_2' },
            { data: 'Aircraft_category_Level_3' },
            { data: 'Aircraft_category_Level_4' },
            { data: 'Manufacturer_model_Level_1' },
            { data: 'Manufacturer_model_Level_2' },
            { data: 'Annex_I_Aircraft' },
            { data: 'Mass_group_L1' },
            { data: 'Mass_Group_L2' },
            { data: 'Propulsion_Type' },
            { data: 'Flight_phase' },
            { data: 'Total_Number_of_Fatalities_Aircraft' },
            { data: 'Total_Number_of_Serious_Injuries_Aircraft' },
            { data: 'Total_Number_of_Fatalities_Ground' },
            { data: 'Total_Number_of_Serious_Injuries_Ground' },
            { data: 'Headline' },
            {
                data: 'Consolidated_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            { data: 'Year' },
            { data: 'Consolidated_Occurrence_Class' },
            { data: 'CS_27_CS_29' },
            { data: 'Annex_I_rotorcraft' },
            { data: 'Foreign_operator_aircraft' },
            { data: 'Rotorcraft_Safety_Roadmap_SPI' }
        ],
        order: [[2, 'asc']],
        columnDefs: [
            {
                targets: 14, // Index for Operation_type_Level_1 (adjust if needed)
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData === 'Medical') {
                        $(td).css('background-color', '#d4edda'); // Light green
                    } else if (cellData === 'Police') {
                        $(td).css('background-color', '#fff3cd'); // Light yellow
                    } else if (cellData.startsWith('Military')) {
                        $(td).css('background-color', '#f8d7da'); // Light red
                    } else if (cellData === 'Commercial') {
                        $(td).css('background-color', '#cfe2ff'); // Light blue
                    } else if (cellData === 'Private') {
                        $(td).css('background-color', '#cccccc'); // Light blue
                    }
                }
            }
        ]
    });

    // Initialize DataTables for Audit Logs
    const $auditTable = $('#audit_table').DataTable({
        ajax: {
            url: '/get_audit_records',
            dataSrc: 'data'
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pageLength', // Add length menu option
                text: 'Rows per page'
            },
            {
                extend: 'searchBuilder',
                config: {
                    depthLimit: 2 // Limits nested conditions (optional)
                }
            },
            {
                extend: 'searchPanes',
                text: 'Filter Data',
                config: {
                    cascadePanes: true, // Automatically filters panes based on selection
                    dtOpts: {
                        dom: 'tp', // Only show table and paging
                        paging: true
                    }
                }
            },
            {
                extend: 'colvis',
                text: 'Show/Hide Columns'
            },
            {
                text: 'Deselect All',
                action: function (e, dt, node, config) {
                    dt.rows().deselect(); // Deselect all rows
                    updateSubmitButton(); // Reset submit button state
                }
            },
            {
                extend: 'csvHtml5',
                text: 'Export CSV'
            },
            {
                text: 'Fullscreen',
                action: function () {
                    toggleFullScreen('audit');
                }
            }         
        ],
        lengthMenu: [
            [10, 25, 50, -1], // Define page lengths: 10, 25, 50, or All
            [10, 25, 50, "All"] // Display text
        ],
        fixedHeader: true, // Enable fixed header
        scrollX: true,
        columns: [
            { data: 'user' },
            {
                data: 'time',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            { data: 'action' },
            { data: 'selected_ids' }
        ],
        order: [[1, 'desc']]
    });

    // Initialize DataTables for Excluded Records
    const $excludedTable = $('#excluded_table').DataTable({
        ajax: {
            url: '/get_excluded_ids',
            dataSrc: 'data'
        },
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pageLength', // Add length menu option
                text: 'Rows per page'
            },
            {
                extend: 'searchBuilder',
                config: {
                    depthLimit: 2 // Limits nested conditions (optional)
                }
            },
            {
                extend: 'searchPanes',
                text: 'Filter Data',
                config: {
                    cascadePanes: true, // Automatically filters panes based on selection
                    dtOpts: {
                        dom: 'tp', // Only show table and paging
                        paging: true
                    }
                }
            },
            {
                extend: 'colvis',
                text: 'Show/Hide Columns'
            },
            {
                text: 'Deselect All',
                action: function (e, dt, node, config) {
                    dt.rows().deselect(); // Deselect all rows
                    updateSubmitButton(); // Reset submit button state
                }
            },
            {
                extend: 'csvHtml5',
                text: 'Export CSV'
            },
            {
                text: 'Fullscreen',
                action: function () {
                    toggleFullScreen('excluded');
                }
            }         
        ],
        lengthMenu: [
            [10, 25, 50, -1], // Define page lengths: 10, 25, 50, or All
            [10, 25, 50, "All"] // Display text
        ],
        fixedHeader: true, // Enable fixed header
        select: { style: 'multi' },
        scrollX: true,
        fixedColumns: {
            leftColumns: 4 // Freezing the first 4 columns
        },
        columns: [
            { data: 'Comments' },
            { data: 'E2_Occurrence_ID' },
            { data: 'File_number' },
            {
                data: 'UTC_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            {
                data: 'Local_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            { data: 'State_area_of_occ' },
            { data: 'Location' },
            { data: 'Occurrence_class' },
            { data: 'Injury_Level' },
            { data: 'Highest_damage' },
            { data: 'Occurrence_Category' },
            { data: 'Aircraft_Registration' },
            { data: 'State_of_Registery' },
            { data: 'Operator_State' },
            { data: 'Operation_type_Level_1' },
            { data: 'Operation_type_Level_2' },
            { data: 'Operation_type_Level_3' },
            { data: 'Operator_Name' },
            { data: 'Aircraft_category_Level_1' },
            { data: 'Aircraft_category_Level_2' },
            { data: 'Aircraft_category_Level_3' },
            { data: 'Aircraft_category_Level_4' },
            { data: 'Manufacturer_model_Level_1' },
            { data: 'Manufacturer_model_Level_2' },
            { data: 'Annex_I_Aircraft' },
            { data: 'Mass_group_L1' },
            { data: 'Mass_Group_L2' },
            { data: 'Propulsion_Type' },
            { data: 'Flight_phase' },
            { data: 'Total_Number_of_Fatalities_Aircraft' },
            { data: 'Total_Number_of_Serious_Injuries_Aircraft' },
            { data: 'Total_Number_of_Fatalities_Ground' },
            { data: 'Total_Number_of_Serious_Injuries_Ground' },
            { data: 'Headline' },
            {
                data: 'Consolidated_date',
                render: function (data) {
                    return data ? moment(data).format('DD/MM/YYYY HH:mm:ss') : '';
                }
            },
            { data: 'Year' },
            { data: 'Consolidated_Occurrence_Class' },
            { data: 'CS_27_CS_29' },
            { data: 'Annex_I_rotorcraft' },
            { data: 'Foreign_operator_aircraft' },
            { data: 'Rotorcraft_Safety_Roadmap_SPI' }
        ],
        order: [[2, 'asc']],
        columnDefs: [
            {
                targets: 14, // Index for Operation_type_Level_1 (adjust if needed)
                createdCell: function (td, cellData, rowData, row, col) {
                    if (cellData === 'Medical') {
                        $(td).css('background-color', '#d4edda'); // Light green
                    } else if (cellData === 'Police') {
                        $(td).css('background-color', '#fff3cd'); // Light yellow
                    } else if (cellData.startsWith('Military')) {
                        $(td).css('background-color', '#f8d7da'); // Light red
                    } else if (cellData === 'Commercial') {
                        $(td).css('background-color', '#cfe2ff'); // Light blue
                    } else if (cellData === 'Private') {
                        $(td).css('background-color', '#cccccc'); // Light blue
                    }
                }
            }
        ]
    });

    // Reset selections and update button states on tab switch
    $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const targetTab = $(e.target).attr("id");

        // Deselect all rows and update button states
        if (targetTab === "occurrences-tab") {
            $occurrenceTable.rows().deselect();
            updateSubmitButton();
            $occurrenceTable.ajax.reload();
        } else if (targetTab === "excluded-tab") {
            $excludedTable.rows().deselect();
            updateExcludedSubmitButton();
            $excludedTable.ajax.reload();
        } else if (targetTab === "audit-tab") {
            $auditTable.ajax.reload();
        }
    });


function toggleFullScreen(elementId) {
    let element = document.getElementById(elementId);
    let $toastContainer = $('#toast-container');

    // Determine the correct table instance
    let tableInstance;
    if (elementId === 'occurrences') {
        tableInstance = $occurrenceTable;
    } else if (elementId === 'audit') {
        tableInstance = $auditTable;
    } else if (elementId === 'excluded') {
        tableInstance = $excludedTable;
    }

    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen().then(() => {
                $toastContainer.detach().appendTo($(element));

                // Force table redraw and fixedHeader recalculation after fullscreen
                setTimeout(() => {
                    tableInstance.columns.adjust().draw();
                    tableInstance.fixedHeader.adjust();
                }, 500);
            });
        }
    } else {
        document.exitFullscreen().then(() => {
            $toastContainer.detach().appendTo('body');

            // Force table redraw and fixedHeader recalculation after exiting fullscreen
            setTimeout(() => {
                tableInstance.columns.adjust().draw();
                tableInstance.fixedHeader.adjust();
            }, 500);
        });
    }
}






    // Generic Function for Performing Actions (Submit/Remove) with Loading Indicator
    function handleOccurrencesAction(buttonSelector, table, endpoint, payloadKey) {
        $(buttonSelector).on('click', function () {
            let selectedIDs = table.rows({ selected: true }).data().toArray().map(row => row.E2_Occurrence_ID);
            if (selectedIDs.length === 0) {
                showToast("Please select at least one record.");
                return;
            }

            const $button = $(this);
            $button.addClass('btn-loading').prop('disabled', true).text('Submitting...');

            $.ajax({
                url: endpoint,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ [payloadKey]: selectedIDs }),
                success: function (response) {
                    showToast(response.message, 'success');
                    table.rows().deselect(); // Deselect all rows after successful submission
                    updateSubmitButton();    // Reset the submit button state
                    table.ajax.reload();     // Refresh table data
                },
                error: function (xhr, status, error) {
                    showToast("An error occurred: " + error, 'error');
                },
                complete: function () {
                    // Reset the button state after completion
                    $button.removeClass('btn-loading').prop('disabled', false).text('Submit Selected Occurrences');
                }
            });
        });
    }


    // Handling Submission and Removal Actions
    handleOccurrencesAction('#submit-ocurrences', $occurrenceTable, '/submit_occurrences', 'occurrencesIDs');
    handleOccurrencesAction('#remove-selected', $excludedTable, '/remove_excluded_ids', 'occurrencesIDs');



    // Refresh Audit Logs Dynamically When Tab Is Clicked
    $('#audit-tab').on('click', function () {
        $auditTable.ajax.reload();
    });

    // Refresh Excluded Records Dynamically When Tab Is Clicked
    $('#excluded-tab').on('click', function () {
        $excludedTable.ajax.reload();
    });

    // Refresh Occurrence Records Dynamically When Tab Is Clicked
    $('#occurrences-tab').on('click', function () {
        $occurrenceTable.ajax.reload();
    });


    // Function to update submit button based on selection count
    function updateSubmitButton() {
        let selectedCount = $occurrenceTable.rows({ selected: true }).count();

        if (selectedCount > 0) {
            $('#submit-ocurrences')
                .addClass('btn-highlight')
                .text(`Exclude ${selectedCount} Occurrence${selectedCount > 1 ? 's' : ''}`);
        } else {
            $('#submit-ocurrences')
                .removeClass('btn-highlight')
                .text('Submit Selected Occurrences');
        }
    }

    // Event listener for row selection changes
    $occurrenceTable.on('select deselect', function () {
        updateSubmitButton();
    });

    // Update Excluded Submit Button
    function updateExcludedSubmitButton() {
        let selectedCount = $excludedTable.rows({ selected: true }).count();
        if (selectedCount > 0) {
            $('#remove-selected')
                .addClass('btn-highlight')
                .text(`Remove ${selectedCount} Excluded Record${selectedCount > 1 ? 's' : ''}`);
        } else {
            $('#remove-selected')
                .removeClass('btn-highlight')
                .text('Remove Selected Excluded Records');
        }
    }

    // Event listener for excluded table selection changes
    $excludedTable.on('select deselect', function () {
        updateExcludedSubmitButton();
    });
});


// Function to show toast notification
function showToast(message, type = 'success') {
    let toastElement = $('#toastMessage');
    let toastContent = $('#toastMessageContent');

    // Update message and style based on type
    toastContent.text(message);
    toastElement.removeClass('bg-primary bg-success bg-danger');

    if (type === 'success') {
        toastElement.addClass('bg-success');
    } else if (type === 'error') {
        toastElement.addClass('bg-danger');
    } else {
        toastElement.addClass('bg-primary');
    }

    // Initialize and show toast
    let toast = new bootstrap.Toast(toastElement[0]);
    toast.show();
}

$(document).ready(function() {
    let scroll = false;
    let launcherMinHeight = 296;
    let launcherMaxHeight = 396;

    // Toggle menu display using jQuery
    $('.button').on('click', function(event) {
        event.stopPropagation();
        const $launcher = $('.app-launcher');
        $launcher.toggle(); // Toggle the visibility
    });

    // Close menu when clicking outside
    $(document).on('click', function() {
        $('.app-launcher').hide();
    });

    // Prevent closing the menu when clicking inside
    $('.app-launcher').on('click', function(event) {
        event.stopPropagation();
    });

    // Expand apps on scroll
    $('.apps').on('wheel', function(e) {
        if (e.originalEvent.deltaY > 0 && !scroll) {
            $('.second-set').show();
            $(this).css('height', launcherMinHeight + 'px');
            scroll = true;
        }
    });

    // Collapse apps on scroll top
    $('.apps').on('scroll', function() {
        if ($(this).scrollTop() === 0) {
            scroll = false;
            $(this).css('height', launcherMaxHeight + 'px');
            $('.second-set').hide();
        }
    });

    // Show more apps on button click
    $('.more').on('click', function() {
        $('.second-set').show();
        $('.apps').scrollTop($('.apps')[0].scrollHeight);
        $('.apps').css('height', launcherMinHeight + 'px');
    });
});

