module NewsItems
  class WithFilters
    def self.call(
      relation = NewsItem.all,
      coins: nil,
      feed_sources: nil,
      news_categories: nil,
      keywords: nil,
      published_since: nil,
      published_until: nil
    )
      result = relation

      # Apply FeedSources filter
      if feed_sources.blank?
        # Default feed sources
        result = result.joins(:feed_source).merge(FeedSource.active.not_reddit.not_twitter)
      else
        result = result.where(feed_source: feed_sources)
      end

      news_coin_mentions = NewsCoinMention.default_tagged

      # Apply Coins filter
      if coins.present?
        result = result
          .joins(:news_coin_mentions)
          .where("news_coin_mentions.id IN (?)", news_coin_mentions.where(coin: coins).select(:id))
      else
        result = result
          .joins('LEFT OUTER JOIN "news_coin_mentions" ON "news_items"."id" = "news_coin_mentions"."news_item_id"
          LEFT OUTER JOIN "coins" ON "news_coin_mentions"."coin_id" = "coins"."id"')
          .merge(Coin.quick_top(20).or(news_coin_mentions.where(id: nil)))
      end

      # Apply NewsCategories filter
      if news_categories.present?
        result = result
          .joins(:news_item_categorizations)
          .where(news_item_categorizations: {
            news_category_id: news_categories.select(:id)
          })
      end

      if keywords.present?
        result = result.where('news_items.title ILIKE ?', "%#{keywords}%")
      end

      if published_since.present?
        result = result.where('news_items.feed_item_published_at > ?', published_since.to_datetime)
      end

      if published_until.present?
        result = result.where('news_items.feed_item_published_at < ?', published_until.to_datetime)
      end

      result = result.group(:id)

      result
    end
  end
end
