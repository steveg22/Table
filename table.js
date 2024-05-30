// https://github.com/accessible-components/tag-input/blob/master/build/tag-input.js
/**
 * TagInput constructor.
 *
 * @constructor
 * @param {HTMLElement} element - Container element.
 * @param {object} options - Options.
 */

class DataTable {
  constructor({ element, data, columns, sortColumn = { field: columns[0].field, order: "asc" } }) {
    if (!element) {
      throw new Error("Element not provided!");
    }

    console.log("data", data);

    this.element = element;
    this.data = data;
    this.columns = columns;

    this.sortColumn = sortColumn;

    this.init();
  }

  /**
   * Sort the table data and display on the given element
   */
  init(tableData = this.data) {
    this.data = tableData;
    this.sortData();
    this.renderTable();
  }

  /**
  * Sort the table data according to the Sort Column state
  */
  sortData() {
    const field = this.sortColumn.field;
    const order = this.sortColumn.order;
    this.data.sort(function(a, b) {
      if (order === "asc")
        return (a[field] > b[field]) - (a[field] < b[field]);

      return (b[field] > a[field]) - (b[field] < a[field]);
    });
  }

  renderTable() {
    // Create table element
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.classList.add("table");

    table.appendChild(this.renderTableHead());

    table.appendChild(this.renderTableBody());

    // Append table to the provided element
    this.element.innerHTML = "";
    this.element.appendChild(table);
  }

  renderTableHead() {
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    this.columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.header;
      th.style.border = '1px solid #ddd';
      th.style.padding = '8px';
      th.style.backgroundColor = '#333';
      th.style.color = '#fff';
      if (!column.ignoreFiltering) {
        if (this.sortColumn.field === column.field) {
          th.dataset.sort = this.sortColumn.order;
        } else {
          th.dataset.sort = "";
        }

        th.addEventListener("click", () => {
          if (this.sortColumn.field === column.field) {
            this.sortColumn.order = this.sortColumn.order === "asc" ? "desc" : "asc";
          } else {
            this.sortColumn.field = column.field;
            this.sortColumn.order = "asc";
          }
          this.sortData();
          this.renderTable();
        });
      }

      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);

    return thead;
  }

  renderTableBody() {
    // Create table body
    const tbody = document.createElement('tbody');

    this.data.forEach(rowData => {
      const row = document.createElement('tr');
      this.columns.forEach(column => {
        const td = document.createElement('td');
        if (column.cell) {
          td.innerHTML = rowData.cell(row);
        } else {
          td.textContent = rowData[column.field];
        }
        td.style.border = '1px solid #ddd';
        td.style.padding = '8px';
        td.style.color = '#e0e0e0';
        td.style.backgroundColor = '#1e1e1e';
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    return tbody;
  }
}
