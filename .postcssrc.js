// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    require('autoprefixer')({browsers:'ios >= 7.0'})
  ]
}