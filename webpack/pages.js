exports.pages = function (env, folder = '') {
  const rootPagesFolderName = 'pages'
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  const fs = require('fs')
  const path = require('path')

  // herramienta para obtener las rutas
  const viewsFolder = path.join(__dirname, `../src/views/${rootPagesFolderName}/${folder}`)

  var pages = []

  // genera un array con todos los archivos dentro de la ruta
  fs.readdirSync(viewsFolder).forEach(view => {

    // quita todos las carpetas y archivos de configuracion
    if (view.split('.')[1] === undefined)
      return false;
      
    // obtiene el nombre del archivo 
    const viewName = view.split('.')[0];
    
    // si existe una prop folder establece eso como el folder anterior
    const fileName = folder === '' ? `${viewName}/index.html` : `${folder}/${viewName}/index.html`;

    // configuraciones para crear el template, en development y production
    const options = {
      minify: !env === 'development',
      filename: fileName,
      template: `views/${rootPagesFolderName}/${folder}/${view}`,
      inject: true
    };

    if (env === 'development') {
      options.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      };
    }

    // agrega una posicion en pages
    pages.push(new HtmlWebpackPlugin(options));
  })

  return pages;
}
