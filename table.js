// https://github.com/accessible-components/tag-input/blob/master/build/tag-input.js
/**
 * TagInput constructor.
 *
 * @constructor
 * @param {HTMLElement} element - Container element.
 * @param {object} options - Options.
 */

class DataTable {
  constructor({ element, data, columns, showSearch = true, sortColumn = { field: columns[0].field, order: "asc" } }) {
    if (!element) {
      throw new Error("Element not provided!");
    }

    this.element = element;
    this.data = data;
    this.filtered = [];
    this.columns = columns;

    this.sortColumn = sortColumn;

    this.showSearch = showSearch;

    //    this.init();
    this.initialDraw();
    this.init();
  }

  initialDraw() {
    const container = document.createElement("div");
    container.classList.add("flow");
    if (this.showSearch) {
      const searchContainer = document.createElement("div");
      searchContainer.classList.add("search-container");
      const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16" class="icon icon--muted">
  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`;
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.classList.add("search");
      searchInput.placeholder = "Search...";
      searchContainer.innerHTML = searchIcon;
      searchContainer.append(searchInput);
      searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.trim().toLowerCase();
        if (searchTerm) {
          this.filtered = this.data.filter((entry) => {
            for (let i = 0; i < this.columns.length; i++) {
              if (!this.columns[i].ignoreFiltering) {
                const field = String(entry[this.columns[i].field]).toLowerCase();
                if (field.indexOf(searchTerm) !== -1) return true;
              }
            }
          });
        } else {
          this.filtered = this.data.slice();
        }
        this.renderTable();
      });
      container.append(searchContainer);
    }
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");
    container.append(tableContainer);

    const paginationContainer = document.createElement("div");
    paginationContainer.classList.add("pagination-container");
    container.append(paginationContainer);

    this.element.append(container);
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
    this.filtered = this.data.slice();
  }

  renderTableHead() {
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    this.columns.forEach(column => {
      const th = document.createElement('th');
      th.textContent = column.header;
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

    this.filtered.forEach(rowData => {
      const row = document.createElement('tr');
      this.columns.forEach(column => {
        const td = document.createElement('td');
        if (column.cell) {
          td.innerHTML = rowData.cell(row);
        } else {
          td.textContent = rowData[column.field];
        }
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    return tbody;
  }

  renderTable() {
    // Create table element
    const table = document.createElement('table');
    table.classList.add("table");

    table.appendChild(this.renderTableHead());

    table.appendChild(this.renderTableBody());

    // Append table to the provided element
    const tableContainer = document.querySelector(".table-container");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }

}
