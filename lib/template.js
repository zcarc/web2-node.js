const sanitizeHTML = require('sanitize-html');

module.exports = {
    html: function (title, list, body, control) {
        return `<!doctype html>

                <html>
                <head>
                  <title>WEB2 - ${title}</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  <h1><a href="/">WEB</a></h1>
                  <a href="/author">Author</a>
                  ${list}
                  ${control}
                  ${body}
                </body>
                </html>
                `;
    },

    list: function (topics) {

        var list = '<ul>';
        var i = 0;
        while (i < topics.length) {
            list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHTML(topics[i].title)}</a></li>`;
            i = i + 1;
        }
        list = list + '</ul>';
        return list;
    },

    authorSelect: function(authors, id) {
      // let selected = authors[index].id === id ? 'selected' : '';

      let authorOptions = '';
      let selected = '';
      authors.map((data, index) => {
          selected = authors[index].id === id ? 'selected' : '';
          authorOptions += `<option value="${authors[index].id}" ${selected}>${sanitizeHTML(authors[index].name)}</option>`;
      });

      return authorOptions;
    },

    tableRows: function(data){
      const tableRows = data.reduce((acc, cur, i) => {
        return (acc +
          `<tr>
             <td>${sanitizeHTML(cur.name)}</td>
             <td>${sanitizeHTML(cur.profile)}</td>
             <td>
                <a href="/author/update?id=${cur.id}">update</a>
             </td>
             <td>
                <form action="/author/delete_process" method="post">
                  <input type="hidden" name="id" value=${cur.id}>
                  <button>delete</button>
                </form>
             </td>
           </tr>`
        );
      }, '');

      return `<table>${tableRows}</table>`;
    }

};