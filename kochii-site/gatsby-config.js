module.exports = {
  siteMetadata: {
    title: `Kochii`,
    description: `Kochii assists and encourages individuals for a manageable meal preparation lifestyle.`,
    siteUrl: `https://www.kochii.app`,
    author: `@jeffreyrampineda`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Kochii App`,
        short_name: `Kochii`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#1c2331`,
        display: `standalone`,
        icon: `static/kochii-logo.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-sitemap`  
  ],
}
