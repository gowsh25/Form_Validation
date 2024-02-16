const express = require("express");
const mysql = require("mysql");

const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// MySQL database connection configuration
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "veera@123",
  database: "e_commerce",
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database as id " + connection.threadId);
});

// Route to fetch data from MySQL database and render HTML page with table



app.get("/category", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const totalCountQuery = "SELECT COUNT(*) AS total FROM category";
  connection.query(totalCountQuery, (error, totalCountResult) => {
    if (error) {
      console.error("Error getting total row count:", error);
      return res.status(500).send("Internal server error");
    }

    const totalRows = totalCountResult[0].total;
    const totalPages = Math.ceil(totalRows / limit);

    const query = `SELECT * FROM category LIMIT ${limit} OFFSET ${offset}`;
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Error executing MySQL query:", error);
        return res.status(500).send("Internal server error");
      }

      // Generate dynamic table HTML
      let tableHtml = "";
      results.forEach((row) => {
        tableHtml += `<tr><td>${
          row.category_id
        }</td><td><a href="/details?category_id=${row.category_id}">${
          row.category_name
        }</a></td><td>${
          row.stock
        }</td><td>${row.date_added.toLocaleDateString()}</td></tr>`;
      });
      tableHtml += "</table>";

      // Generate dynamic pagination HTML
      let paginationHtml = "<div>";
      if (page > 1) {
        paginationHtml += `<a href="/details?page=${page - 1}">Previous</a> `;
      }
      if (page < totalPages) {
        paginationHtml += `<a href="/details?page=${page + 1}">Next</a>`;
      }
      paginationHtml += "</div>";

      // Read and modify the template file
      fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, data) => {
        if (err) {
          console.error("Error reading HTML file:", err);
          return res.status(500).send("Error reading HTML file");
        }

        // Replace placeholders with dynamic content
        let output = data
          .replace("<!--TABLE_PLACEHOLDER-->", tableHtml)
          .replace("<!--PAGINATION_PLACEHOLDER-->", paginationHtml);

        res.send(output);
      });
    });
  });
});

app.get("/details", (req, res) => {
  const categoryId = req.query.category_id; // Getting category_id from query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  connection.query(
    "SELECT category_id, category_name FROM category",
    (categoriesError, categories) => {
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
        return res.status(500).send("Internal server error");
      }

      // Dynamically generate the HTML for the category dropdown
      let categoryDropdownHtml = `<select  class="custom-select" id="categoryDropdown"  onchange="window.location.href='/details?category_id=' + this.value;">`;
      // categoryDropdownHtml += `<option value="">All Categories</option>`; // Option to show all categories or a default selection
      // categoryDropdownHtml += `<option value="">All Products</option>`;
      categories.forEach((category) => {
        const isSelected =
          category.category_id.toString() === categoryId ? " selected" : "";
        categoryDropdownHtml += `<option value="${category.category_id}"${isSelected}>${category.category_name}</option>`;
      });
      categoryDropdownHtml += `</select>`;

      // Query to count total products for pagination
      const countQuery = categoryId
        ? "SELECT COUNT(*) AS count FROM products WHERE category_id = ?"
        : "SELECT COUNT(*) AS count FROM products";
      const countQueryParams = categoryId ? [categoryId] : [];

      connection.query(countQuery, countQueryParams, (error, countResult) => {
        if (error) {
          console.error("Error executing count MySQL query: " + error.stack);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
        const totalCount = countResult[0].count;
        const totalPages = Math.ceil(totalCount / limit);
        // Query to fetch products for the current page
        const query =
          "SELECT * FROM products WHERE category_id = ? LIMIT ? OFFSET ?";
        connection.query(
          query,
          [categoryId, limit, offset],
          (error, results) => {
            if (error) {
              console.error("Error executing MySQL query: " + error.stack);
              res.status(500).json({ error: "Internal server error" });
              return;
            }

            // Read the external HTML template
            fs.readFile(
              path.join(__dirname, "products.html"),
              "utf8",
              (err, htmlTemplate) => {
                if (err) {
                  console.error("Error reading HTML file:", err);
                  return res.status(500).send("Error reading HTML file");
                }

                // Generate the HTML for table rows
                let tableRows = results
                  .map(
                    (product) => `
          <tr>
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.brand}</td>
            <td>${product.MRP}</td>
            <td>${product.discount_price}</td>
            <td>${product.date_added.toLocaleDateString()}</td>
            <td>${product.category_id}</td>
          </tr>
        `
                  )
                  .join("");

                // Generate pagination links
                let paginationLinks = `<nav><ul class="pagination">`;
                if (page > 1) {
                  paginationLinks += `<li class="page-item"><a class="page-link" href="/details?category_id=${categoryId}&page=${
                    page - 1
                  }">Previous</a></li>`;
                }
                if (page < totalPages) {
                  paginationLinks += `<li class="page-item"><a class="page-link" href="/details?category_id=${categoryId}&page=${
                    page + 1
                  }">Next</a></li>`;
                }
                paginationLinks += `</ul></nav>`;

                let backButtonHtml = `<a href="/category" class="btn btn-primary">Back to Category Page</a>`;

                // Replace placeholders in the HTML template with dynamic content
                // Replace placeholders in the HTML template with dynamic content
                let finalHtml = htmlTemplate
                  .replace("<!--TABLE_CONTENT-->", tableRows)
                  .replace("<!--PAGINATION_CONTENT-->", paginationLinks)
                  .replace("<!--BACK_BUTTON-->", backButtonHtml)
                  .replace("<!--CATEGORY_DROPDOWN-->", categoryDropdownHtml); // Add this line

                // Generate the "Back to Category Page" button HTML

                // Send the modified HTML as the response
                res.send(finalHtml);
              }
            );
          }
        );
      });
    }
  );
});

app.get("/products", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // First, count the total number of products
  const countQuery = "SELECT COUNT(*) AS count FROM products";
  connection.query(countQuery, (countError, countResult) => {
    if (countError) {
      console.error("Error counting products:", countError);
      return res.status(500).send("Internal server error");
    }

    const totalProducts = countResult[0].count;
    const totalPages = Math.ceil(totalProducts / limit);

    // Then, fetch the products for the current page
    const query = "SELECT * FROM products LIMIT ? OFFSET ?";
    connection.query(query, [limit, offset], (error, results) => {
      if (error) {
        console.error("Error fetching products:", error);
        return res.status(500).send("Internal server error");
      }

      // Read the external HTML template
      fs.readFile(
        path.join(__dirname, "products.html"),
        "utf8",
        (err, htmlTemplate) => {
          if (err) {
            console.error("Error reading HTML file:", err);
            return res.status(500).send("Error reading HTML file");
          }

          // Generate the HTML for table rows
          let tableRows = results
            .map(
              (product) => `
          <tr>
            <td>${product.product_id}</td>
            <td>${product.product_name}</td>
            <td>${product.brand}</td>
            <td>${product.MRP}</td>
            <td>${product.discount_price}</td>
            <td>${product.date_added.toLocaleDateString()}</td>
            <td>${product.category_id}</td>
          </tr>
        `
            )
            .join("");

          // Generate pagination links
          let paginationHtml = "";
          if (page > 1) {
            paginationHtml += `<a href="/products?page=${
              page - 1
            }" class="btn btn-primary">Previous</a>`;
          }
          if (page < totalPages) {
            paginationHtml += `<a href="/products?page=${
              page + 1
            }" class="btn btn-primary ml-2">Next</a>`;
          }
          let backButtonHtml = `<a href="/category" class="btn btn-primary mt-2">Back to Category Page</a>`;

          // Replace placeholders in the HTML template
          let finalHtml = htmlTemplate
            .replace("<!--TABLE_CONTENT-->", tableRows)
            .replace("<!--PAGINATION_CONTENT-->", paginationHtml)
            .replace("<!--BACK_BUTTON-->", backButtonHtml);

          // Send the modified HTML as the response
          res.send(finalHtml);
        }
      );
    });
  });
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
