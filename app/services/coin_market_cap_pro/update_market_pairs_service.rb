module CoinMarketCapPro
  class UpdateMarketPairsService < Patterns::Service
    include CoinMarketCapProHelpers
    attr_accessor :cmc_missing_data

    def initialize(start: 0, limit: 20) # 0-indexed
      @cmc_missing_data = Rails.cache.read("tasks/market_pairs/cmc_missing_data") || []
      @start = start
      @limit = limit
    end

    def call
      coins = Coin.top(@limit).offset(@start)
      puts "About to process #{coins.count} coins"
      puts "Nothing to do here. items was empty... bye." and return if coins.none?

      progress = ProgressBar.create(:title => "coins", :total => coins.count)
      items_with_errors = []

      coins.each do |coin|
        begin
          update_coin_pairs(coin)
          progress.increment
        rescue StandardError => e
          items_with_errors << coin.id
          puts "Got an error on coin id #{coin.id}"
          puts e
          puts e.backtrace
          puts "#{items_with_errors.length} errors so far"
        end
      end

      puts "Complete!"
      log_missing_data
      if items_with_errors.present?
        puts "Found #{items_with_errors.length} total errors"
        puts "Encountered errors when trying to process these coins ids: #{items_with_errors}"
      end
    end

    private

    def log_missing_data
      if @cmc_missing_data.empty?
        Net::HTTP.get(URI.parse(ENV.fetch('HEALTHCHECK_MARKET_PAIRS')))
      else
        Net::HTTP.post(URI.parse("#{ENV.fetch('HEALTHCHECK_MARKET_PAIRS')}/fail"), @cmc_missing_data.to_json)
      end

      Rails.cache.write("tasks/market_pairs/cmc_missing_data", @cmc_missing_data)
    end

    def update_coin_pairs(coin)
      data = coin.cmc_id ? load_cmc_pair_data(id: coin.cmc_id) : load_cmc_pair_data(symbol: coin.symbol)

      if data.present?
        identifier = coin.slug
        perform_update_pairs(identifier, data)
      end
    end

    def perform_update_pairs(identifier, data)
      # Grabbing data from snapshot cache
      snapshot = Rails.cache.read("#{identifier}:snapshot")
      base_volume24h = snapshot[:volume24h] unless snapshot.blank?
      has_base_volume24h = base_volume24h.present? && base_volume24h != 0

      raw_market_pairs = data.dig("market_pairs")
      market_pairs = raw_market_pairs.map do |pair|
        quote = pair.dig("quote", currency)
        volume24h = quote["volume_24h"] || 0

        {
          :exchange_name => pair.dig("exchange", "name"),
          :exchange_slug => pair.dig("exchange", "slug"),
          :pair => pair["market_pair"],
          :price => quote["price"],
          :volume24h => volume24h,
          :volume_percentage => (if has_base_volume24h then volume24h / base_volume24h else 0 end),
          :volume24h_quote => pair.dig("quote", "exchange_reported", "volume_24h_quote"),
          :quote_currency_symbol => pair.dig("market_pair_quote", "currency_symbol"),
        }
      end

      coin_hash = {
        :total_pairs => data["num_market_pairs"],
        :market_pairs => market_pairs,
        :last_retrieved => Time.now.utc.to_s,
      }
      Rails.cache.write("#{identifier}:pairs", coin_hash)
    end

    def load_cmc_pair_data(id: nil, symbol: nil)
      return nil if id.nil? and symbol.nil?

      api_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/market-pairs/latest"
      query = if id.nil? then { :symbol => symbol } else { :id => id } end
      headers = { "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY') }
      response = HTTParty.get(api_url, :query => query, :headers => headers)
      contents = JSON.parse(response.body)

      # ping health check if api error
      json_response_code = get_json_response_code(contents)

      # remove current entry from missing data list; will be added back in anyways if it fails
      @cmc_missing_data = @cmc_missing_data.reject do |e|
        if symbol.present?
          e[:symbol] == symbol
        elsif id.present?
          e[:id] == id
        else
          false
        end
      end

      if response.success? && json_response_code == 0 then
        return contents['data']
      else
        error_message = "ERROR HTTP(#{response.code}) JSON(#{json_response_code}): #{get_error_message(contents)}"
        @cmc_missing_data << { id: id, symbol: symbol, error: error_message }
        return nil
      end
    end
  end
end