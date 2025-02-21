const genetateTeble = (table, checkbox) => {

    // Inicializar la tabla bootstrapTable
    table.bootstrapTable({
        columns: [
            { field: 'state', checkbox: true, align: 'center', valign: 'middle', sortable: false }
        ]
    });

    if (checkbox) {
        handleChekcBoxStyles(table);
    }
}


// Asigna los estilos personalizados a los checkboxes
const handleChekcBoxStyles = (table) => {
    table.on('post-body.bs.table', ()  => {
        table.find('.bs-checkbox input[type="checkbox"]').each(function() {
            const $checkbox = $(this);
            const checkboxId = $checkbox.attr('id') || 'checkbox' + Math.random().toString(36).substring(7);
            $checkbox.attr('id', checkboxId);

            // Crear el label solo si no existe
            if (!$checkbox.next('label').length) {
                $checkbox.after('<label for="' + checkboxId + '" class="custom-checkbox"></label>');
            }
        });
    });
};

const handlerForm = (form) => {
    const fomId = `#${form.attr('id')}`;
    
    form.on('submit', (e) => {
        e.preventDefault(); // Evita el envío predeterminado
      
        // Obtener todos los checkboxes seleccionados en la tabla
        let selectedRows = [];
      
        $(`${fomId} tbody input[type="checkbox"]:checked`).each(function() {
          let $row = $(this).closest('tr'); // Obtener la fila donde está el checkbox
          let rowData = {};
      
          // Recorrer las celdas de la fila y obtener los valores
          $row.find('td').each(function(index) {
            let columnName = $(`${fomId} thead th:nth-child(${index + 2})`).text().trim().replace(" ", "_");
            if (columnName) rowData[columnName] = $(this).text().trim();
          });
      
          selectedRows.push(rowData);
        });
      
        if (selectedRows.length) {
          console.log("Sending..", selectedRows);
          if(!$(`${fomId} .alert`).hasClass("d-none" )){
            $(`${fomId} .alert`).addClass("d-none" );
          }
        } else {
            $(`${fomId} .alert`).removeClass("d-none" );
        }
      });
}


// Al hacer clic en las pestañas, se cargan las tablas correspondientes
$(document).ready(function()  {
    const $excludedTable = $('#excluded_table');
    const $occurrenceTable = $('#occurrence_table');
    const $occurrenceForm = $('#occurrence-form');
    const $excludedForm = $('#excluded-form');

    genetateTeble($excludedTable, true);
    genetateTeble($occurrenceTable, true);

    handlerForm($occurrenceForm);
    handlerForm($excludedForm);

    $('#remove-selected').on('click', () => {
        let selectedIDs = getSelectedExcludedRecords("excluded_table");
        if (selectedIDs.length === 0) {
            alert("Please select at least one record.");
            return;
        }

        $.ajax({
            url: '/remove_excluded_ids',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ "occurrencesIDs": selectedIDs }),
            success: (response) => {
                alert(response.message);
            },
            error: (xhr, status, error) => {
                alert("Error: " + error);
            }
        });
    });
});


