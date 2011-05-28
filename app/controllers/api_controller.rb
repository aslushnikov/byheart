class ApiController < ApplicationController
  before_filter :forbid_user!

  def check_auth
    head :ok 
  end

  def all_words
    render :json => current_user.words 
  end

  def add_words
    begin
      words = ActiveSupport::JSON.decode(request.raw_post) 
      if !words.is_a? Array
        raise "Bad format!"
      end
      out = []
      words.each do |word|
        if !word.is_a? Hash
          raise "Bad format!"
        end
        w = Word.new(word)
        out << w
        current_user.words << w
      end
      render :json => out
    rescue
      head :bad_request and return
    end
  end

  protected
    def forbid_user!
      if !user_signed_in?
        head :unauthorized
      end
    end
end
