# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://#{ENV.fetch('ROOT_DOMAIN')}"

# Disable automatically including root url
SitemapGenerator::Sitemap.include_root = false

# Sitemap gets uploaded to AWS S3 since Heroku only has ephemeral filesystem.
SitemapGenerator::Sitemap.adapter = SitemapGenerator::S3Adapter.new(
  fog_provider: 'AWS',
  aws_access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID'),
  aws_secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY'),
  fog_directory: ENV.fetch('S3_BUCKET'),
  fog_region: 'us-east-1'
)

SitemapGenerator::Sitemap.create do
  # Put links creation logic here.
  #
  # The root path '/' and sitemap index file are added automatically for you.
  # Links are added to the Sitemap in the order they are specified.
  #
  # Usage: add(path, options={})
  #        (default options are used if you don't specify)
  #
  # Defaults: :priority => 0.5, :changefreq => 'weekly',
  #           :lastmod => Time.now, :host => default_host
  #
  # Examples:
  #
  # Add '/articles'
  #
  #   add articles_path, :priority => 0.7, :changefreq => 'daily'
  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end

  add root_path, :priority => 1.0, :changefreq => 'always'
  add page_about_path, :priority => 0.8, :changefreq => 'daily'
  add page_press_path, :priority => 0.8, :changefreq => 'daily'
  add page_calendar_path, :priority => 0.8, :changefreq => 'daily'
  add page_ambassadors_path, :priority => 0.8, :changefreq => 'daily'
  add page_win_cofi_path, :priority => 0.8, :changefreq => 'daily'

  add calculator_path('bitcoin-investment-calculator'), :changefreq => 'daily'
  add podcast_path, :changefreq => 'daily'
  add coins_path, :changefreq => 'hourly'
  add news_path, :changefreq => 'hourly'

  Coin::ICO_STATUSES.each do |status|
    add icos_path(status), :changefreq => 'daily'
  end

  Coin.listed.where.not(slug: nil).find_each do |coin|
    add coin_path(id_or_slug: coin.slug), :changefreq => 'hourly'
    add news_coin_path(coin_slug: coin.slug), :changefreq => 'hourly'
  end
end
