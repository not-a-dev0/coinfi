require 'application_integration_test'
require 'test_helper'

class NewsRenderTest < ApplicationIntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    Rails.application.load_seed
    @user = create(:user)
    @coins = create_list(:coin_with_news_items, 20)

    login_as(@user, :scope => :user)
  end

  test "index renders news items" do
    Rails.cache.delete("default_news_items")

    get news_url

    expected_news_items = NewsItems::WithFilters.call(NewsItem.published, published_since: 24.hours.ago).order_by_published.limit(25)
    expected_news_items.each do |news_item|
      assert_select "*", text: news_item.title
    end
  end

  test "coin index renders news items" do
    coin = @coins.first

    get news_coin_url(coin.slug)

    expected_news_items = NewsItems::WithFilters.call(NewsItem.published, coins: [coin]).order_by_published.limit(25)
    expected_news_items.each do |news_item|
      assert_select "*", text: news_item.title
    end
  end

  test "show renders news items" do
    Rails.cache.delete("default_news_items")

    news_item = @coins.first.news_items.published.first
    news_item_slug = news_item.title.parameterize

    get news_item_url(news_item, news_item_slug)

    expected_news_items = NewsItems::WithFilters.call(NewsItem.published, published_since: 24.hours.ago).order_by_published.limit(25)
    expected_news_items.each do |news_item|
      assert_select "*", text: news_item.title
    end
  end
end
